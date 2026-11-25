import { describe, expect, it } from 'vitest';
import { STEP } from '../src/core/config';
import { FixedLoop } from '../src/core/loop';

describe('FixedLoop', () => {
  it('runs a whole number of fixed steps and returns alpha in [0,1)', () => {
    let n = 0;
    const loop = new FixedLoop(() => n++);
    const a = loop.advance(STEP * 2.5);
    expect(n).toBe(2);
    expect(a).toBeCloseTo(0.5, 5);
  });

  it('clamps huge frames (tab switch) to avoid the spiral of death', () => {
    let n = 0;
    const loop = new FixedLoop(() => n++);
    loop.advance(10);
    expect(n).toBeLessThanOrEqual(Math.ceil(0.05 / STEP));
  });
});
