/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { classifyDevice, DeviceFacts } from './deviceCheck';
import { downloadBytesFor } from './modelConfig';

const laptop: DeviceFacts = {
  webgpu: true,
  shaderF16: true,
  memoryGb: 8,
  cores: 8,
  storageFreeGb: 40,
  mobile: false,
  metered: false,
  workers: true
};

describe('classifyDevice', () => {
  test('a laptop with WebGPU is ready', () => {
    expect(classifyDevice(laptop).tier).toBe('ready');
  });

  test('no WebGPU means the slow CPU path', () => {
    const r = classifyDevice({ ...laptop, webgpu: false, shaderF16: false });
    expect(r.tier).toBe('slow');
    expect(r.reason).toContain('WebGPU');
  });

  test('phones are unsuitable even with WebGPU', () => {
    expect(classifyDevice({ ...laptop, mobile: true }).tier).toBe('unsuitable');
  });

  test('low memory or storage is unsuitable', () => {
    expect(classifyDevice({ ...laptop, memoryGb: 2 }).tier).toBe('unsuitable');
    expect(classifyDevice({ ...laptop, storageFreeGb: 0.8 }).reason).toContain('0.8 GB');
  });

  test('unreported memory and storage are not held against the device', () => {
    expect(classifyDevice({ ...laptop, memoryGb: null, storageFreeGb: null }).tier).toBe('ready');
  });

  test('download size follows the dtype the worker picks', () => {
    expect(downloadBytesFor(true, true)).toBeLessThan(downloadBytesFor(true, false));
    expect(downloadBytesFor(true, false)).toBeLessThan(downloadBytesFor(false, false));
  });
});
