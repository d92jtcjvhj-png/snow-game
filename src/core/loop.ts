import { MAX_FRAME, STEP } from './config';

/**
 * Fixed-step accumulator. Physics always advances by STEP, whatever the frame rate;
 * `alpha` (0..1) tells the renderer how far it is between the previous and current step.
 */
export class FixedLoop {
  private acc = 0;

  constructor(private readonly stepFn: (dt: number) => void, readonly step = STEP) {}

  /** Advance by `realDt` seconds of wall time. Returns the interpolation alpha. */
  advance(realDt: number): number {
    this.acc += Math.min(Math.max(realDt, 0), MAX_FRAME);
    while (this.acc >= this.step) {
      this.stepFn(this.step);
      this.acc -= this.step;
    }
    return this.acc / this.step;
  }

  reset(): void {
    this.acc = 0;
  }
}
