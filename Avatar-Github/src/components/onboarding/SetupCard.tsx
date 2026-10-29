import React from 'react';
import { AlertTriangle, Download, Loader2, RotateCcw, Wifi } from 'lucide-react';
import { ModelWorkerState } from '../../services/aiWorkerClient';
import { DeviceReport } from '../../services/deviceCheck';
import { CHAT_MODEL, downloadBytesFor, formatGb } from '../../services/modelConfig';

interface SetupCardProps {
  avatarName: string;
  device: DeviceReport | null;
  model: ModelWorkerState;
  dismissed: boolean;
  onDownload: () => void;
  onDismiss: () => void;
  onOpenModels: () => void;
}

const primary =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-accent-600 hover:bg-accent-700 text-white text-sm font-semibold cursor-pointer';
const secondary =
  'inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer';
const link = 'underline underline-offset-2 hover:text-slate-900 dark:hover:text-white cursor-pointer';

/**
 * Offered in the chat the first time a question needs the model, instead of a
 * requirements screen up front. The question is answered once the download finishes.
 */
export const SetupCard: React.FC<SetupCardProps> = ({ avatarName, device, model, dismissed, onDownload, onDismiss, onOpenModels }) => {
  if (model.status === 'loading') {
    const mb = (b: number) => Math.round(b / 1e6);
    return (
      <div className="space-y-2" role="status" aria-live="polite">
        <p>
          Downloading {CHAT_MODEL.label}… you can keep adding notes or practising. I’ll answer your question as soon as it’s ready.
        </p>
        <div className="max-w-sm">
          <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div className="h-full rounded-full bg-accent-500 transition-all duration-500" style={{ width: `${model.progressPct}%` }} />
          </div>
          <div className="mt-1 flex justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>{model.progressPct}%</span>
            {model.totalBytes > 0 && (
              <span>
                {mb(model.loadedBytes)} / {mb(model.totalBytes)} MB
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (model.status === 'error') {
    return (
      <div className="space-y-3">
        <p className="flex items-start gap-1.5">
          <AlertTriangle className="w-4 h-4 mt-1 shrink-0 text-rose-500" />
          <span>The download stopped. {model.errorMessage} Your notes are safe.</span>
        </p>
        <button type="button" onClick={onDownload} className={primary}>
          <RotateCcw className="w-4 h-4" />
          Try again
        </button>
      </div>
    );
  }

  if (model.status === 'ready') return null;

  if (dismissed) {
    return (
      <p className="text-slate-500 dark:text-slate-400">
        No problem. Practice questions and calculators work without it.{' '}
        <button type="button" onClick={onDownload} className={link}>
          Set up the AI
        </button>{' '}
        whenever you’re ready and I’ll answer this.
      </p>
    );
  }

  if (!device) {
    return (
      <p className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        Checking this device…
      </p>
    );
  }

  if (device.tier === 'unsuitable') {
    return (
      <div className="space-y-3">
        <p>
          I can’t answer here: Avatar Network’s AI needs a laptop or desktop with Chrome, Edge or Safari. {device.reason}
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Practice questions and calculators still work on this device, and your notes stay saved for when you switch.
        </p>
        <button type="button" onClick={onOpenModels} className={`${secondary} border border-slate-200 dark:border-slate-700`}>
          See requirements
        </button>
      </div>
    );
  }

  const size = formatGb(downloadBytesFor(device.webgpu, device.shaderF16));
  return (
    <div className="space-y-3">
      <p>
        To answer questions, {avatarName} needs a one-time download of {CHAT_MODEL.label} (≈{size}). It runs privately in this
        browser, and nothing you ask leaves your device.
      </p>
      {device.tier === 'slow' && (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {device.reason} Answers will take about a minute each; Chrome or Edge on a laptop with a graphics chip, or Safari 26+ on a Mac, is much faster.
        </p>
      )}
      {device.metered && (
        <p className="flex items-center gap-1.5 text-sm text-amber-700 dark:text-amber-300">
          <Wifi className="w-4 h-4 shrink-0" />
          You seem to be on mobile data or Data Saver. Wi-Fi is better for a download this size.
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1">
        <button type="button" onClick={onDownload} className={primary}>
          <Download className="w-4 h-4" />
          {device.tier === 'slow' ? 'Download anyway' : `Download (${size})`}
        </button>
        <button type="button" onClick={onDismiss} className={secondary}>
          Not now
        </button>
      </div>
    </div>
  );
};
