/**
 * Single source of truth for the on-device models Avatar Network downloads and runs.
 * Sizes are the ONNX weight files on the Hugging Face Hub; they drive the
 * download progress bar before every file has reported its own size.
 */

export const CHAT_MODEL = {
  id: 'onnx-community/gemma-3-1b-it-ONNX',
  label: 'Gemma 3 1B',
  // Pinned Hub commit, so upstream changes to the repo can't break the app; bump deliberately
  revision: 'a58439f40017d3b99c7d378ff525e54e0ba08ebf',
  // Gemma 3 1B accepts up to 32K tokens of prompt + reply
  contextWindow: 32_768,
  // WebGPU with shader-f16 → q4f16, other WebGPU adapters → q4, CPU (WASM) → int8
  bytesByDtype: { q4f16: 763_000_000, q4: 859_000_000, int8: 1_002_000_000 } as Record<string, number>
};

export const EMBEDDING_MODEL = {
  id: 'onnx-community/embeddinggemma-300m-ONNX',
  label: 'EmbeddingGemma 300M',
  revision: '5090578d9565bb06545b4552f76e6bc2c93e4a66',
  // Activations don't support fp16, so the embedder stays on WASM at q8
  dtype: 'q8' as const,
  bytes: 309_000_000,
  // Matryoshka truncation of the 768-d output
  dimension: 256,
  maxTokens: 512,
  queryPrefix: 'task: search result | query: ',
  documentPrefix: (title?: string) => `title: ${title?.trim() || 'none'} | text: `
};

export const MODELS_LABEL = `${CHAT_MODEL.label} + ${EMBEDDING_MODEL.label}`;
export const APPROX_DOWNLOAD_LABEL = '~1.1 GB';

// Set once both models have loaded successfully; returning visitors load from cache automatically
export const MODELS_READY_FLAG = 'lumen_models_ready_v1';

/** Total one-time download for a device, matching the dtype the worker will pick */
export function downloadBytesFor(webgpu: boolean, shaderF16: boolean): number {
  const dtype = webgpu ? (shaderF16 ? 'q4f16' : 'q4') : 'int8';
  return CHAT_MODEL.bytesByDtype[dtype] + EMBEDDING_MODEL.bytes;
}

export const formatGb = (bytes: number) => `${(bytes / 1e9).toFixed(1)} GB`;
