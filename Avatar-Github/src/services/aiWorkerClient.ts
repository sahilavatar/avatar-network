import { CHAT_MODEL, EMBEDDING_MODEL, MODELS_READY_FLAG } from './modelConfig';
import { describeLoadError } from './loadErrors';
import type { ChatTurn, ModelRole, WorkerRequest, WorkerResponse } from '../workers/aiWorkerProtocol';

export type { ChatTurn } from '../workers/aiWorkerProtocol';

export interface ModelWorkerState {
  status: 'idle' | 'loading' | 'ready' | 'error';
  loadedBytes: number;
  totalBytes: number;
  progressPct: number;
  stageMessage?: string;
  activeFile?: string;
  chatLabel: string;
  embedderLabel: string;
  device?: 'webgpu' | 'wasm';
  dtype?: string;
  errorMessage?: string;
  // Models were fully downloaded on a previous visit, so loading comes from browser cache
  previouslyDownloaded: boolean;
}

export interface GenerateResult {
  text: string;
  inputTokens: number;
  outputTokens: number;
  ms: number;
  interrupted: boolean;
}

interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason: Error) => void;
  onToken?: (text: string) => void;
  streamed?: string;
}

const readFlag = () => {
  try {
    return localStorage.getItem(MODELS_READY_FLAG) === 'true';
  } catch {
    return false;
  }
};

const ROLES: ModelRole[] = ['embed', 'chat'];

interface RoleProgress {
  loaded: number;
  total: number;
  ready: boolean;
  message?: string;
}

class AIWorkerClient {
  // One worker per model, so each gets its own WASM heap
  private workers: Record<ModelRole, Worker | null> = { embed: null, chat: null };
  private progress: Record<ModelRole, RoleProgress> = this.freshProgress();
  // Shared with the chat worker so Stop works while it's busy generating (needs cross-origin isolation)
  private abortFlag: Int32Array | null =
    typeof SharedArrayBuffer !== 'undefined' && (globalThis as any).crossOriginIsolated
      ? new Int32Array(new SharedArrayBuffer(4))
      : null;
  private pending = new Map<number, PendingRequest>();
  private nextId = 1;
  private readyPromise: Promise<void> | null = null;
  private resolveReady: (() => void) | null = null;
  private rejectReady: ((err: Error) => void) | null = null;
  private listeners = new Set<(state: ModelWorkerState) => void>();
  private state: ModelWorkerState = {
    status: 'idle',
    loadedBytes: 0,
    totalBytes: 0,
    progressPct: 0,
    chatLabel: CHAT_MODEL.label,
    embedderLabel: EMBEDDING_MODEL.label,
    previouslyDownloaded: readFlag()
  };

  private gpuCheck: Promise<boolean> | null = null;

  /** Whether WebGPU exposes a usable adapter (navigator.gpu alone can exist without one) */
  public detectWebGpu(): Promise<boolean> {
    if (!this.gpuCheck) {
      const gpu = typeof navigator !== 'undefined' ? (navigator as any).gpu : undefined;
      this.gpuCheck = gpu
        ? Promise.resolve(gpu.requestAdapter())
            .then((adapter: unknown) => !!adapter)
            .catch(() => false)
        : Promise.resolve(false);
    }
    return this.gpuCheck;
  }

  private hasWebGpuApi(): boolean {
    return typeof navigator !== 'undefined' && !!(navigator as any).gpu;
  }

  public getState(): ModelWorkerState {
    return { ...this.state };
  }

  public isReady(): boolean {
    return this.state.status === 'ready';
  }

  public subscribe(listener: (state: ModelWorkerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private update(patch: Partial<ModelWorkerState>) {
    this.state = { ...this.state, ...patch };
    const snapshot = this.getState();
    this.listeners.forEach((fn) => fn(snapshot));
  }

  private freshProgress(): Record<ModelRole, RoleProgress> {
    // Refined by the worker's real progress once files start downloading
    const chatGuess = this.hasWebGpuApi() ? CHAT_MODEL.bytesByDtype.q4f16 : CHAT_MODEL.bytesByDtype.int8;
    return {
      embed: { loaded: 0, total: EMBEDDING_MODEL.bytes, ready: false },
      chat: { loaded: 0, total: chatGuess, ready: false }
    };
  }

  /** Downloads (or loads from cache) both models. Resolves once they can run. */
  public start(): Promise<void> {
    if (this.readyPromise && this.state.status !== 'error') return this.readyPromise;

    this.terminateWorkers();
    this.progress = this.freshProgress();
    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.resolveReady = resolve;
      this.rejectReady = reject;
    });
    // Callers that don't await start() shouldn't trigger unhandled rejections
    this.readyPromise.catch(() => undefined);

    this.update({
      status: 'loading',
      loadedBytes: 0,
      totalBytes: 0,
      progressPct: 0,
      stageMessage: 'Starting…',
      errorMessage: undefined
    });

    try {
      for (const role of ROLES) {
        const worker = new Worker(new URL('../workers/ai.worker.ts', import.meta.url), { type: 'module' });
        worker.onmessage = (e: MessageEvent<WorkerResponse>) => this.handleMessage(role, e.data);
        worker.onerror = (e) => this.fail(e.message || 'The model worker crashed');
        this.workers[role] = worker;
        this.post(role, { type: 'load', role, abortFlag: role === 'chat' ? (this.abortFlag?.buffer as SharedArrayBuffer | undefined) : undefined });
      }
    } catch (err) {
      this.fail(err instanceof Error ? err.message : 'Web Workers are not supported in this browser');
    }
    return this.readyPromise;
  }

  private terminateWorkers() {
    ROLES.forEach((role) => {
      this.workers[role]?.terminate();
      this.workers[role] = null;
    });
  }

  private post(role: ModelRole, msg: WorkerRequest) {
    this.workers[role]?.postMessage(msg);
  }

  private fail(message: string) {
    if (this.state.status === 'error') return;
    this.terminateWorkers();
    console.error('AI model failed:', message);
    this.update({ status: 'error', errorMessage: describeLoadError(message) });
    this.rejectReady?.(new Error(message));
    this.pending.forEach((req) => req.reject(new Error(message)));
    this.pending.clear();
  }

  private publishProgress(activeFile?: string) {
    const loaded = this.progress.embed.loaded + this.progress.chat.loaded;
    const total = this.progress.embed.total + this.progress.chat.total;
    this.update({
      loadedBytes: loaded,
      totalBytes: total,
      progressPct: total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0,
      stageMessage: this.progress.chat.message ?? this.progress.embed.message,
      ...(activeFile ? { activeFile } : {})
    });
  }

  private handleMessage(role: ModelRole, msg: WorkerResponse) {
    switch (msg.type) {
      case 'status':
        this.progress[role].message = msg.message;
        this.publishProgress();
        break;
      case 'progress':
        this.progress[role].loaded = msg.loaded;
        this.progress[role].total = msg.total;
        this.publishProgress(msg.file);
        break;
      case 'ready':
        this.progress[role].ready = true;
        this.progress[role].loaded = this.progress[role].total;
        this.progress[role].message = undefined;
        if (role === 'chat') this.update({ device: msg.device, dtype: msg.dtype });
        if (!ROLES.every((r) => this.progress[r].ready)) {
          this.publishProgress();
          break;
        }
        try {
          localStorage.setItem(MODELS_READY_FLAG, 'true');
        } catch {
          // Storage unavailable; the next visit just shows the download button again
        }
        // Ask the browser not to evict the ~1 GB of weights when space runs low
        navigator.storage?.persist?.().catch(() => undefined);
        this.update({ status: 'ready', progressPct: 100, stageMessage: undefined, previouslyDownloaded: true });
        this.resolveReady?.();
        break;
      case 'token': {
        const req = this.pending.get(msg.id);
        if (req) {
          req.streamed = (req.streamed || '') + msg.text;
          req.onToken?.(req.streamed);
        }
        break;
      }
      case 'done': {
        const req = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        req?.resolve({
          text: msg.text,
          inputTokens: msg.inputTokens,
          outputTokens: msg.outputTokens,
          ms: msg.ms,
          interrupted: msg.interrupted
        } satisfies GenerateResult);
        break;
      }
      case 'embed_done': {
        const req = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        req?.resolve(msg.vectors);
        break;
      }
      case 'error':
        if (msg.id !== undefined && this.pending.has(msg.id)) {
          this.pending.get(msg.id)?.reject(new Error(msg.message));
          this.pending.delete(msg.id);
        } else {
          this.fail(msg.message);
        }
        break;
    }
  }

  private async request<T>(role: ModelRole, build: (id: number) => WorkerRequest, onToken?: (text: string) => void): Promise<T> {
    if (!this.isReady()) {
      throw new Error('The on-device model is not loaded yet');
    }
    return new Promise<T>((resolve, reject) => {
      const id = this.nextId++;
      this.pending.set(id, { resolve, reject, onToken });
      this.post(role, build(id));
    });
  }

  /** Embeds texts for retrieval. Callers add the query/document prefixes. */
  public embed(texts: string[]): Promise<number[][]> {
    if (texts.length === 0) return Promise.resolve([]);
    return this.request<number[][]>('embed', (id) => ({ type: 'embed', id, texts }));
  }

  /** Streams a chat completion; onToken receives the full text generated so far. */
  public generate(
    messages: ChatTurn[],
    options: { maxNewTokens?: number; temperature?: number; onToken?: (textSoFar: string) => void } = {}
  ): Promise<GenerateResult> {
    if (this.abortFlag) Atomics.store(this.abortFlag, 0, 0);
    return this.request<GenerateResult>(
      'chat',
      (id) => ({
        type: 'generate',
        id,
        messages,
        maxNewTokens: options.maxNewTokens ?? 384,
        temperature: options.temperature ?? 0.7
      }),
      options.onToken
    );
  }

  /** Stops the generation in progress; its promise resolves with what was produced. */
  public abort() {
    if (this.abortFlag) Atomics.store(this.abortFlag, 0, 1);
    this.post('chat', { type: 'abort' });
  }

  /** Removes downloaded weights from browser storage. */
  public async clearCache() {
    this.terminateWorkers();
    this.readyPromise = null;
    try {
      localStorage.removeItem(MODELS_READY_FLAG);
      const names = await caches.keys();
      await Promise.all(names.filter((n) => n.includes('transformers')).map((n) => caches.delete(n)));
    } catch {
      // Nothing cached or storage unavailable
    }
    this.update({ status: 'idle', loadedBytes: 0, totalBytes: 0, progressPct: 0, previouslyDownloaded: false });
  }
}

export const aiWorkerClient = new AIWorkerClient();
