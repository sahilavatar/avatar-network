/**
 * Quiet device check run on load. It only reads what the browser reports and
 * sorts the device into one of three groups; nothing is shown unless it matters.
 */

export type DeviceTier = 'ready' | 'slow' | 'unsuitable';

export interface DeviceFacts {
  webgpu: boolean;
  shaderF16: boolean;
  // navigator.deviceMemory: Chromium only, capped at 8
  memoryGb: number | null;
  cores: number | null;
  storageFreeGb: number | null;
  mobile: boolean;
  // Data Saver on, or a cellular connection
  metered: boolean;
  workers: boolean;
}

export interface DeviceReport extends DeviceFacts {
  tier: DeviceTier;
  // Why the device isn't 'ready', in plain words for the user
  reason?: string;
}

// Download plus room for the browser to unpack it
export const MIN_FREE_STORAGE_GB = 1.5;
export const MIN_MEMORY_GB = 4;

export function classifyDevice(facts: DeviceFacts): DeviceReport {
  if (!facts.workers) return { ...facts, tier: 'unsuitable', reason: 'This browser can’t run the AI in the background.' };
  if (facts.mobile) return { ...facts, tier: 'unsuitable', reason: 'Phones and tablets don’t have enough memory for the AI model yet.' };
  if (facts.memoryGb !== null && facts.memoryGb < MIN_MEMORY_GB) {
    return { ...facts, tier: 'unsuitable', reason: `This device reports ${facts.memoryGb} GB of memory; the AI model needs at least ${MIN_MEMORY_GB} GB.` };
  }
  if (facts.storageFreeGb !== null && facts.storageFreeGb < MIN_FREE_STORAGE_GB) {
    return { ...facts, tier: 'unsuitable', reason: `There’s only ${facts.storageFreeGb} GB of space for this site; the AI model needs about ${MIN_FREE_STORAGE_GB} GB.` };
  }
  if (!facts.webgpu) return { ...facts, tier: 'slow', reason: 'This browser has no WebGPU, so the AI runs on the CPU.' };
  return { ...facts, tier: 'ready' };
}

function isMobile(): boolean {
  const nav = navigator as Navigator & { userAgentData?: { mobile?: boolean } };
  if (typeof nav.userAgentData?.mobile === 'boolean') return nav.userAgentData.mobile;
  // iPadOS reports itself as a Mac; touch points give it away
  if (/Macintosh/.test(nav.userAgent) && nav.maxTouchPoints > 1) return true;
  return /Android|iPhone|iPad|iPod|Mobile/i.test(nav.userAgent);
}

function isMetered(): boolean {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; type?: string } }).connection;
  return !!conn && (conn.saveData === true || conn.type === 'cellular');
}

async function readGpu(): Promise<{ webgpu: boolean; shaderF16: boolean }> {
  const gpu = (navigator as any).gpu;
  if (!gpu) return { webgpu: false, shaderF16: false };
  try {
    const adapter = await gpu.requestAdapter();
    return { webgpu: !!adapter, shaderF16: !!adapter?.features?.has('shader-f16') };
  } catch {
    return { webgpu: false, shaderF16: false };
  }
}

async function readFreeStorageGb(): Promise<number | null> {
  try {
    const estimate = await navigator.storage?.estimate?.();
    if (!estimate?.quota) return null;
    return Math.round(((estimate.quota - (estimate.usage || 0)) / 1e9) * 10) / 10;
  } catch {
    return null;
  }
}

let pending: Promise<DeviceReport> | null = null;

/** Runs once per page load; later calls share the result */
export function checkDevice(): Promise<DeviceReport> {
  if (!pending) {
    pending = Promise.all([readGpu(), readFreeStorageGb()]).then(([gpu, storageFreeGb]) => {
      const nav = navigator as Navigator & { deviceMemory?: number };
      return classifyDevice({
        ...gpu,
        memoryGb: nav.deviceMemory ?? null,
        cores: nav.hardwareConcurrency || null,
        storageFreeGb,
        mobile: isMobile(),
        metered: isMetered(),
        workers: typeof Worker !== 'undefined' && typeof WebAssembly !== 'undefined'
      });
    });
  }
  return pending;
}
