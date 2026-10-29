/// <reference lib="webworker" />
/**
 * On-device model worker, run with transformers.js (ONNX Runtime Web). Each instance
 * loads one role: EmbeddingGemma for retrieval or Gemma 3 1B for tutoring replies.
 * Separate workers give each model its own 4 GB WASM heap, so on the CPU path both
 * fit, and retrieval never waits behind a running generation.
 */
import {
  AutoModel,
  AutoModelForCausalLM,
  AutoTokenizer,
  InterruptableStoppingCriteria,
  StoppingCriteria,
  TextStreamer,
  env,
  type PreTrainedModel,
  type PreTrainedTokenizer,
  type ProgressInfo
} from '@huggingface/transformers';
import { CHAT_MODEL, EMBEDDING_MODEL } from '../services/modelConfig';
import type { ChatTurn, ModelRole, WorkerRequest, WorkerResponse } from './aiWorkerProtocol';

// Models only come from the Hub (pinned revisions, see modelConfig); never probe the app's own origin for /models/*.
// ONNX Runtime's WASM comes from jsDelivr, transformers.js's default (see vite.config.ts).
env.allowLocalModels = false;

const ctx = self as unknown as DedicatedWorkerGlobalScope;
const post = (msg: WorkerResponse) => ctx.postMessage(msg);

let tokenizer: PreTrainedTokenizer | null = null;
let model: PreTrainedModel | null = null;
const stopper = new InterruptableStoppingCriteria();
let abortFlag: Int32Array | null = null;

/** Stops generation once the app sets the shared abort flag */
class SharedFlagStoppingCriteria extends StoppingCriteria {
  constructor(private flag: Int32Array) {
    super();
  }
  _call(input_ids: number[][]): boolean[] {
    return new Array(input_ids.length).fill(Atomics.load(this.flag, 0) === 1);
  }
}
const wasAborted = () => stopper.interrupted || (abortFlag !== null && Atomics.load(abortFlag, 0) === 1);

// Serialize this worker's model work
let queue: Promise<unknown> = Promise.resolve();
const enqueue = <T>(task: () => Promise<T>): Promise<T> => {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
};

type Backend = { device: 'webgpu' | 'wasm'; dtype: string; singleFile?: boolean };

/**
 * Chat model builds to try, best first. The 4-bit builds use a quantized embedding
 * gather that ONNX Runtime's WASM backend can't run, so the CPU path uses int8.
 * The repo config claims every build has external weights, but the int8 build is a
 * single file; transformers.js hangs on the missing data file unless told otherwise.
 */
async function chatBackendCandidates(): Promise<Backend[]> {
  const cpu: Backend = { device: 'wasm', dtype: 'int8', singleFile: true };
  const gpu = (ctx.navigator as any).gpu;
  if (gpu) {
    try {
      const adapter = await gpu.requestAdapter();
      if (adapter) {
        const gpuBuilds: Backend[] = adapter.features.has('shader-f16')
          ? [{ device: 'webgpu', dtype: 'q4f16' }, { device: 'webgpu', dtype: 'q4' }]
          : [{ device: 'webgpu', dtype: 'q4' }];
        return [...gpuBuilds, cpu];
      }
    } catch {
      // Fall through to the CPU build
    }
  }
  return [cpu];
}

function progressReporter(expectedTotal: number) {
  const files = new Map<string, { loaded: number; total: number }>();
  return (info: ProgressInfo) => {
    if (info.status !== 'progress') return;
    files.set(info.file, { loaded: info.loaded, total: info.total });
    let loaded = 0;
    let total = 0;
    files.forEach((f) => {
      loaded += f.loaded;
      total += f.total;
    });
    post({ type: 'progress', loaded, total: Math.max(total, expectedTotal), file: info.file });
  };
}

async function loadEmbedder() {
  const onProgress = progressReporter(EMBEDDING_MODEL.bytes);
  post({ type: 'status', message: `Loading ${EMBEDDING_MODEL.label}…` });
  tokenizer = await AutoTokenizer.from_pretrained(EMBEDDING_MODEL.id, { revision: EMBEDDING_MODEL.revision, progress_callback: onProgress });
  model = await AutoModel.from_pretrained(EMBEDDING_MODEL.id, {
    revision: EMBEDDING_MODEL.revision,
    dtype: EMBEDDING_MODEL.dtype,
    device: 'wasm',
    progress_callback: onProgress
  });
  post({ type: 'ready', device: 'wasm', dtype: EMBEDDING_MODEL.dtype });
}

async function loadChat() {
  const candidates = await chatBackendCandidates();
  const onProgress = progressReporter(CHAT_MODEL.bytesByDtype[candidates[0].dtype] ?? 0);

  post({ type: 'status', message: `Loading ${CHAT_MODEL.label}…` });
  tokenizer = await AutoTokenizer.from_pretrained(CHAT_MODEL.id, { revision: CHAT_MODEL.revision, progress_callback: onProgress });

  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      model = await AutoModelForCausalLM.from_pretrained(CHAT_MODEL.id, {
        revision: CHAT_MODEL.revision,
        dtype: candidate.dtype as any,
        device: candidate.device,
        ...(candidate.singleFile ? { use_external_data_format: false } : {}),
        progress_callback: onProgress
      });
      // Compile shaders / warm kernels so the first real question isn't slow; some
      // unsupported operators only surface on the first run
      post({ type: 'status', message: 'Warming up…' });
      const warm = tokenizer.apply_chat_template([{ role: 'user', content: 'Hi' }], {
        add_generation_prompt: true,
        return_dict: true
      }) as Record<string, any>;
      await model.generate({ ...warm, max_new_tokens: 1 });
      post({ type: 'ready', device: candidate.device, dtype: candidate.dtype });
      return;
    } catch (err) {
      await model?.dispose().catch(() => undefined);
      model = null;
      // Unsupported operator or adapter limits on this device; try the next build
      lastError = err;
      console.warn(`${CHAT_MODEL.label} ${candidate.device}/${candidate.dtype} failed to load:`, err);
      post({ type: 'status', message: `Trying another ${CHAT_MODEL.label} build for this device…` });
    }
  }
  throw lastError ?? new Error(`${CHAT_MODEL.label} could not be loaded on this device`);
}

async function embed(texts: string[]): Promise<number[][]> {
  if (!tokenizer || !model) throw new Error('Embedding model is not loaded');
  const dim = EMBEDDING_MODEL.dimension;
  const vectors: number[][] = [];
  const batchSize = 8;

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const inputs = await tokenizer(batch, { padding: true, truncation: true, max_length: EMBEDDING_MODEL.maxTokens });
    const { sentence_embedding } = await model(inputs);
    const data = sentence_embedding.data as Float32Array;
    const width = sentence_embedding.dims[1];

    for (let row = 0; row < batch.length; row++) {
      // Matryoshka: keep the leading dimensions, then re-normalize
      const v = Array.from(data.subarray(row * width, row * width + dim));
      const norm = Math.hypot(...v) || 1;
      vectors.push(v.map((x) => x / norm));
    }
  }
  return vectors;
}

async function generate(id: number, messages: ChatTurn[], maxNewTokens: number, temperature: number) {
  if (!tokenizer || !model) throw new Error('Chat model is not loaded');
  const start = performance.now();
  stopper.reset();

  const inputs = tokenizer.apply_chat_template(messages, {
    add_generation_prompt: true,
    return_dict: true
  }) as Record<string, any>;
  const inputTokens = inputs.input_ids.dims[1] as number;

  const streamer = new TextStreamer(tokenizer, {
    skip_prompt: true,
    skip_special_tokens: true,
    callback_function: (text: string) => post({ type: 'token', id, text })
  });

  const output = (await model.generate({
    ...inputs,
    max_new_tokens: maxNewTokens,
    do_sample: temperature > 0,
    temperature,
    top_p: 0.95,
    top_k: 64,
    streamer,
    stopping_criteria: abortFlag ? [stopper, new SharedFlagStoppingCriteria(abortFlag)] : stopper
  })) as any;

  const newTokens = output.slice(null, [inputTokens, null]);
  const text = tokenizer.batch_decode(newTokens, { skip_special_tokens: true })[0].trim();

  post({
    type: 'done',
    id,
    text,
    inputTokens,
    outputTokens: newTokens.dims[1],
    ms: Math.round(performance.now() - start),
    interrupted: wasAborted()
  });
}

ctx.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  if (msg.type === 'abort') {
    stopper.interrupt();
    return;
  }

  const fail = (err: unknown, id?: number) =>
    post({ type: 'error', id, message: err instanceof Error ? err.message : String(err) });

  if (msg.type === 'load') {
    if (msg.abortFlag) abortFlag = new Int32Array(msg.abortFlag);
    const loaders: Record<ModelRole, () => Promise<void>> = { embed: loadEmbedder, chat: loadChat };
    enqueue(loaders[msg.role]).catch((err) => fail(err));
  } else if (msg.type === 'embed') {
    enqueue(() => embed(msg.texts))
      .then((vectors) => post({ type: 'embed_done', id: msg.id, vectors }))
      .catch((err) => fail(err, msg.id));
  } else if (msg.type === 'generate') {
    enqueue(() => generate(msg.id, msg.messages, msg.maxNewTokens, msg.temperature)).catch((err) => fail(err, msg.id));
  }
};
