import React from 'react';
import { AlertTriangle, CheckCircle2, Cpu, Download, HardDrive, Loader2, MemoryStick, MonitorSmartphone, RotateCcw } from 'lucide-react';
import { Dialog } from './ui/overlays';
import { aiWorkerClient } from '../services/aiWorkerClient';
import { CHAT_MODEL, EMBEDDING_MODEL, downloadBytesFor, formatGb } from '../services/modelConfig';
import { MIN_FREE_STORAGE_GB, MIN_MEMORY_GB } from '../services/deviceCheck';
import { useDeviceReport, useModelState } from './onboarding/useSetupState';

interface ModelsModalProps {
  open: boolean;
  onClose: () => void;
}

const toMB = (bytes: number) => Math.round(bytes / 1_000_000);

const Stat: React.FC<{ icon: React.ReactNode; label: string; value: string; ok?: boolean | null }> = ({ icon, label, value, ok }) => (
  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
    <span className="text-slate-500 dark:text-slate-400">{icon}</span>
    <span className="min-w-0">
      <span className="block text-[11px] text-slate-500 dark:text-slate-400">{label}</span>
      <span className={`block text-sm font-medium ${ok === false ? 'text-amber-700 dark:text-amber-300' : 'text-slate-900 dark:text-white'}`}>{value}</span>
    </span>
  </div>
);

export const ModelsModal: React.FC<ModelsModalProps> = ({ open, onClose }) => {
  const model = useModelState();
  const device = useDeviceReport();

  const ready = model.status === 'ready';
  const loading = model.status === 'loading';
  const start = () => aiWorkerClient.start().catch(() => undefined);
  const downloadBytes = device ? downloadBytesFor(device.webgpu, device.shaderF16) : CHAT_MODEL.bytesByDtype.q4f16 + EMBEDDING_MODEL.bytes;
  const unsuitable = device?.tier === 'unsuitable';
  const check = (ok: boolean | null | undefined) => (ok === null || ok === undefined ? '' : ok ? ' ✓' : ' ✗');

  return (
    <Dialog open={open} onClose={onClose} title="Models" wide>
      <div className="p-6 space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Avatar Network runs AI models inside your browser. They download once from Hugging Face, stay cached on this device, and
          never send your notes anywhere.
        </p>

        <section aria-label="This device">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">This device</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat
              icon={<MonitorSmartphone className="w-4 h-4" />}
              label="Graphics (WebGPU)"
              value={!device ? 'Checking…' : device.webgpu ? 'Available' : 'Not available'}
              ok={device?.webgpu}
            />
            <Stat icon={<Cpu className="w-4 h-4" />} label="CPU cores" value={device?.cores ? String(device.cores) : 'Unknown'} />
            <Stat
              icon={<MemoryStick className="w-4 h-4" />}
              label="Memory"
              value={device?.memoryGb ? `${device.memoryGb >= 8 ? '8+ ' : `${device.memoryGb} `}GB` : 'Not reported'}
              ok={device?.memoryGb == null ? null : device.memoryGb >= MIN_MEMORY_GB}
            />
            <Stat
              icon={<HardDrive className="w-4 h-4" />}
              label="Space for this site"
              value={device?.storageFreeGb != null ? `${device.storageFreeGb} GB` : 'Not reported'}
              ok={device?.storageFreeGb == null ? null : device.storageFreeGb >= MIN_FREE_STORAGE_GB}
            />
          </div>
          {device && (
            <p
              className={`mt-2 text-xs ${device.tier === 'ready' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-300'}`}
            >
              {device.tier === 'ready'
                ? `This device can run ${CHAT_MODEL.label} on its graphics chip.`
                : device.tier === 'slow'
                  ? `${device.reason} It works, but answers take about a minute each. Chrome or Edge on a laptop with a graphics chip, or Safari 26+ on a Mac, is much faster.`
                  : `${device.reason} Avatar Network’s AI needs a laptop or desktop with Chrome, Edge or Safari.`}
            </p>
          )}
        </section>

        <section aria-label="Supported models" className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Supported models</h3>

          {/* Current setup: chat + search models download together */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-semibold text-slate-900 dark:text-white">{CHAT_MODEL.label}</h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent-50 dark:bg-accent-950/60 text-accent-700 dark:text-accent-300">
                    Standard
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                  Chat model by Google; answers from your notes first, general knowledge otherwise. Downloads with {EMBEDDING_MODEL.label} (search model, {toMB(EMBEDDING_MODEL.bytes)} MB).
                </p>
              </div>
              {ready ? (
                <span className="flex items-center gap-1 text-sm font-medium text-emerald-700 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  Ready
                </span>
              ) : loading ? (
                <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-300 shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {model.progressPct}%
                </span>
              ) : (
                <button
                  type="button"
                  onClick={start}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold shrink-0 cursor-pointer ${
                    unsuitable
                      ? 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      : 'bg-accent-600 hover:bg-accent-700 text-white'
                  }`}
                >
                  {model.status === 'error' ? <RotateCcw className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {model.status === 'error' ? 'Retry' : unsuitable || device?.tier === 'slow' ? 'Download anyway' : 'Download'}
                </button>
              )}
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-slate-400">Download</dt>
                <dd className="text-slate-700 dark:text-slate-200">
                  ≈ {formatGb(downloadBytes)} for this device, one time{check(device?.storageFreeGb == null ? null : device.storageFreeGb >= MIN_FREE_STORAGE_GB)}
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Best on</dt>
                <dd className="text-slate-700 dark:text-slate-200">Chrome, Edge or Safari 26+ (WebGPU){check(device?.webgpu)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Memory</dt>
                <dd className="text-slate-700 dark:text-slate-200">
                  8 GB RAM recommended{check(device?.memoryGb == null ? null : device.memoryGb >= MIN_MEMORY_GB)}
                </dd>
              </div>
            </dl>

            {loading && (
              <div role="status" aria-live="polite">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span className="truncate">{model.stageMessage}</span>
                  {model.totalBytes > 0 && (
                    <span className="tabular-nums shrink-0">
                      {toMB(model.loadedBytes)} / {toMB(model.totalBytes)} MB
                    </span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-accent-500 transition-all" style={{ width: `${model.progressPct}%` }} />
                </div>
              </div>
            )}
            {ready && model.device && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Running on {model.device === 'webgpu' ? 'your graphics chip (WebGPU)' : 'the CPU (WASM)'} · {model.dtype}
              </p>
            )}
            {model.status === 'error' && (
              <p className="flex items-start gap-1.5 text-xs text-rose-600 dark:text-rose-400" role="alert">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                {model.errorMessage}
              </p>
            )}
          </div>

          {/* Planned higher-quality tier, not yet available */}
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-4 opacity-80">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white">Gemma 4 E2B</h4>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Quality · coming soon
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">Noticeably stronger reasoning for laptops with a capable graphics chip.</p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <dt className="text-slate-400">Download</dt>
                <dd className="text-slate-700 dark:text-slate-200">≈ 3.1 GB, one time</dd>
              </div>
              <div>
                <dt className="text-slate-400">Needs</dt>
                <dd className="text-slate-700 dark:text-slate-200">WebGPU with fp16 support</dd>
              </div>
              <div>
                <dt className="text-slate-400">Memory</dt>
                <dd className="text-slate-700 dark:text-slate-200">16 GB RAM recommended</dd>
              </div>
            </dl>
          </div>
        </section>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Files are stored for this website only. <a href="privacy.html" className="underline hover:text-slate-700 dark:hover:text-slate-200">How your data is handled</a>
        </p>
      </div>
    </Dialog>
  );
};
