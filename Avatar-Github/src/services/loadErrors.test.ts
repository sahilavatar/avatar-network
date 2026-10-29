/// <reference types="bun" />
import { expect, test } from 'bun:test';
import { describeLoadError } from './loadErrors';

test('maps common load failures to actionable advice', () => {
  expect(describeLoadError('QuotaExceededError: The quota has been exceeded.')).toContain('ran out of storage');
  expect(describeLoadError('TypeError: Failed to fetch')).toContain('connection dropped');
  expect(describeLoadError('net::ERR_CONNECTION_RESET')).toContain('connection dropped');
  expect(describeLoadError('TypeError: Load failed')).toContain('connection dropped'); // Safari's fetch error
  expect(describeLoadError('RangeError: Array buffer allocation failed')).toContain('ran out of memory');
  expect(describeLoadError('Aborted(). Build with -sASSERTIONS for more info.')).toContain('ran out of memory');
  expect(describeLoadError('weird failure')).toContain('(weird failure)');
});
