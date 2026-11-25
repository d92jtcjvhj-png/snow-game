import type { GrabId } from '../physics/spin';
import { BOARD, POP } from './config';

/**
 * Player input. The player never steers: left thumb = charge (side = spin direction, distance = power)
 * and release = pop; right side = speed check (analog) and off-axis stick.
 * Touch (src/ui/controls.ts) and keyboard both write here; touch wins while a finger is down.
 */
export interface InputState {
  charging: boolean;
  charge: number;
  axis: number;
  brake: number;
  /** grab held (in the air) */
  grab: GrabId | null;
}

export class Input {
  /** touch-driven values */
  readonly touch = { charging: false, charge: 0, axis: 0, brake: 0, stickActive: false, brakeActive: false, grab: null as GrabId | null };
  private readonly keys = new Set<string>();
  private kbCharge = 0;
  private kbBrake = 0;
  /** true while the keyboard is in use (for the on-screen charge bar) */
  keyboardCharging = false;
  onKey: ((code: string) => void) | null = null;

  constructor() {
    window.addEventListener('keydown', (e) => {
      if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
      if (!this.keys.has(e.code)) this.onKey?.(e.code);
      this.keys.add(e.code);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
  }

  /** Current input; call once per frame with the real frame time (keyboard ramps). */
  read(dt: number): InputState {
    const k = this.keys;
    const z = k.has('KeyZ'), x = k.has('KeyX'), sp = k.has('Space');
    if (z) this.kbCharge = Math.max(-1, this.kbCharge - dt * POP.KEY_RATE);
    else if (x) this.kbCharge = Math.min(1, this.kbCharge + dt * POP.KEY_RATE);
    const kbHeld = z || x || sp;
    if (!kbHeld) this.kbCharge = 0;
    this.keyboardCharging = kbHeld && !this.touch.charging;
    // first frame of Z/X: jump over the dead zone so the side is set at once
    if ((z || x) && Math.abs(this.kbCharge) < POP.DEAD) this.kbCharge = (x ? 1 : -1) * POP.DEAD;
    const b = k.has('KeyB') || k.has('ArrowDown') && k.has('ShiftLeft');
    // pressed = light check (edge 25°), held = sits harder on the heels up to 65°
    this.kbBrake = b ? Math.min(1, Math.max(0.05, this.kbBrake + dt / BOARD.CHECK_RAMP)) : 0;
    const kbAxis = (k.has('ArrowUp') ? 1 : 0) - (k.has('ArrowDown') ? 1 : 0);
    const t = this.touch;
    const kbGrab: GrabId | null = k.has('KeyQ') ? 'nose' : k.has('KeyW') ? 'mute' : k.has('KeyE') ? 'indy' : k.has('KeyR') ? 'tail' : null;
    return {
      grab: t.grab ?? kbGrab,
      charging: t.charging || kbHeld,
      charge: t.charging ? t.charge : this.kbCharge,
      axis: t.stickActive ? t.axis : kbAxis,
      brake: t.brakeActive ? t.brake : this.kbBrake,
    };
  }
}

export function vibrate(ms: number): void {
  try { navigator.vibrate?.(ms); } catch { /* not supported */ }
}
