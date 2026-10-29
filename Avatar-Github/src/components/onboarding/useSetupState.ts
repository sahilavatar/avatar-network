import { useEffect, useState } from 'react';
import { aiWorkerClient, ModelWorkerState } from '../../services/aiWorkerClient';
import { checkDevice, DeviceReport } from '../../services/deviceCheck';

/** Live model download/load state */
export function useModelState(): ModelWorkerState {
  const [state, setState] = useState<ModelWorkerState>(aiWorkerClient.getState());
  useEffect(() => aiWorkerClient.subscribe(setState), []);
  return state;
}

/** Device check result; null while it runs (it takes a few milliseconds) */
export function useDeviceReport(): DeviceReport | null {
  const [report, setReport] = useState<DeviceReport | null>(null);
  useEffect(() => {
    let active = true;
    checkDevice()
      .then((r) => active && setReport(r))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);
  return report;
}
