/// <reference types="bun" />
import { describe, expect, test } from 'bun:test';
import { dispatchNativeJsTool, parsePolynomialEquation } from './engineDispatcher';

describe('parsePolynomialEquation', () => {
  test.each([
    ['2x^2 - 4x - 6 = 0', { a: 2, b: -4, c: -6 }],
    ['2x² - 4x - 6 = 0', { a: 2, b: -4, c: -6 }],
    ['x² − 9 = 0', { a: 1, b: 0, c: -9 }],
    ['-x^2 + 4x = 0', { a: -1, b: 4, c: 0 }],
    ['x^2 + 5x + 6 = 0', { a: 1, b: 5, c: 6 }],
    ['2x + 6 = 14', { a: 0, b: 2, c: -8 }],
    ['5x = 25', { a: 0, b: 5, c: -25 }]
  ])('%s', (text, expected) => {
    expect(parsePolynomialEquation(text)).toMatchObject(expected);
  });

  test('rejects text without an exact equation', () => {
    expect(parsePolynomialEquation('2 + 2 = 4')).toBeNull();
    expect(parsePolynomialEquation('what is f(x) = 3 here')).toBeNull();
    expect(parsePolynomialEquation('explain quadratics')).toBeNull();
  });
});

describe('dispatchNativeJsTool equations', () => {
  test('quadratic written with a superscript is solved as a quadratic', () => {
    // Regression: "x²" used to fall through to the linear solver and report x = -1.5
    const res = dispatchNativeJsTool('Solve 2x² - 4x - 6 = 0', 'algebra');
    expect(res?.toolName).toBe('JavaScript Quadratic Math Engine');
    expect(res?.result).toContain('x₁ = 3');
    expect(res?.result).toContain('x₂ = -1');
    expect(res?.result).toContain('Vertex: (1, -8)');
  });

  test('quadratic with a missing linear term', () => {
    const res = dispatchNativeJsTool('solve x^2 - 9 = 0', 'algebra');
    expect(res?.result).toContain('x₁ = 3');
    expect(res?.result).toContain('x₂ = -3');
  });

  test('linear equation', () => {
    const res = dispatchNativeJsTool('Solve 2x + 6 = 14', 'algebra');
    expect(res?.toolName).toBe('JavaScript Linear Equation Engine');
    expect(res?.result).toBe('x = 4');
  });

  test('a bare equation counts as a request to solve it', () => {
    expect(dispatchNativeJsTool('3x - 9 = 0', 'algebra')?.result).toBe('x = 3');
  });

  test('questions that only mention an equation are left to the tutor', () => {
    expect(dispatchNativeJsTool('Why does 2x + 6 = 14 have one solution while quadratics have two?', 'algebra')).toBeNull();
  });
});

describe('dispatchNativeJsTool other tools', () => {
  test('percentages', () => {
    expect(dispatchNativeJsTool('what is 15% of 80', 'algebra')?.result).toBe('12');
  });

  test('molar mass', () => {
    const res = dispatchNativeJsTool('molar mass of H2O', 'chemistry');
    expect(res?.toolName).toBe('JavaScript Molar Mass Engine');
    expect(parseFloat(res!.result)).toBeCloseTo(18.015, 1);
  });

  test('ordinary questions trigger no tool', () => {
    expect(dispatchNativeJsTool('Why did the Anti-Federalists oppose ratification?', 'history')).toBeNull();
  });
});
