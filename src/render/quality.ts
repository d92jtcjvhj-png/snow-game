export type Tier = 'low' | 'medium' | 'high';

export interface TierSettings {
  maxPixelRatio: number;
  shadows: boolean;
  shadowMapSize: number;
}

export const TIERS: Record<Tier, TierSettings> = {
  low: { maxPixelRatio: 1, shadows: false, shadowMapSize: 512 },
  medium: { maxPixelRatio: 1.5, shadows: false, shadowMapSize: 1024 },
  high: { maxPixelRatio: 2, shadows: true, shadowMapSize: 2048 },
};
const ORDER: Tier[] = ['low', 'medium', 'high'];

const SLOW_MS = 20, FAST_MS = 12, DOWN_AFTER = 2, UP_AFTER = 5;

/**
 * Adaptive quality: picks a starting tier from the device, then watches a moving average
 * of the frame time. >20 ms for 2 s → one tier down; <12 ms for 5 s → one tier up.
 * Antialiasing is fixed at start (it cannot change without recreating the WebGL context).
 */
export class QualityManager {
  tier: Tier;
  private avgMs = 16;
  private slowT = 0;
  private fastT = 0;

  constructor(private readonly onChange: (tier: Tier, s: TierSettings) => void, initial = QualityManager.guess()) {
    this.tier = initial;
  }

  static guess(): Tier {
    if (typeof window === 'undefined') return 'medium';
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    const cores = navigator.hardwareConcurrency || 4;
    if (coarse) return cores >= 8 ? 'medium' : 'low';
    return 'high';
  }

  get settings(): TierSettings {
    return TIERS[this.tier];
  }

  /** Call once per rendered frame with the real frame time (s). */
  sample(dt: number): void {
    if (dt <= 0 || dt > 0.25) return; // ignore tab switches and pauses
    this.avgMs += (dt * 1000 - this.avgMs) * 0.05;
    if (this.avgMs > SLOW_MS) { this.slowT += dt; this.fastT = 0; }
    else if (this.avgMs < FAST_MS) { this.fastT += dt; this.slowT = 0; }
    else { this.slowT = this.fastT = 0; }
    const i = ORDER.indexOf(this.tier);
    if (this.slowT > DOWN_AFTER && i > 0) this.set(ORDER[i - 1]!);
    else if (this.fastT > UP_AFTER && i < ORDER.length - 1) this.set(ORDER[i + 1]!);
  }

  get frameMs(): number {
    return this.avgMs;
  }

  set(tier: Tier): void {
    this.slowT = this.fastT = 0;
    if (tier === this.tier) return;
    this.tier = tier;
    this.onChange(tier, TIERS[tier]);
  }
}
