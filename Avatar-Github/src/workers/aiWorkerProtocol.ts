/** Messages exchanged between aiWorkerClient and ai.worker */

export interface ChatTurn {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export type ModelRole = 'embed' | 'chat';

export type WorkerRequest =
  // abortFlag: shared Int32 the app sets to 1 to stop generation; a busy WASM worker
  // can't process an 'abort' message until generation finishes
  | { type: 'load'; role: ModelRole; abortFlag?: SharedArrayBuffer }
  | { type: 'embed'; id: number; texts: string[] }
  | { type: 'generate'; id: number; messages: ChatTurn[]; maxNewTokens: number; temperature: number }
  | { type: 'abort' };

export type WorkerResponse =
  | { type: 'status'; message: string }
  | { type: 'progress'; loaded: number; total: number; file: string }
  | { type: 'ready'; device: 'webgpu' | 'wasm'; dtype: string }
  | { type: 'embed_done'; id: number; vectors: number[][] }
  | { type: 'token'; id: number; text: string }
  | {
      type: 'done';
      id: number;
      text: string;
      inputTokens: number;
      outputTokens: number;
      ms: number;
      interrupted: boolean;
    }
  | { type: 'error'; id?: number; message: string };
