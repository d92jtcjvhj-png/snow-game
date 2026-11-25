import { GRAB_NAME, mainGrab, type SpinState } from '../physics/spin';

const MULT = (n: number) => (n === 2 ? 'Double ' : n === 3 ? 'Triple ' : n === 4 ? 'Quad ' : n === 5 ? 'Quint ' : n > 5 ? n + 'x ' : '');

export interface TrickInfo {
  name: string;
  deg: number;
  grab: string | null;
  grabTime: number;
}

/**
 * Trick name (ported from the legacy trickName): direction (Frontside / Backside / Cab / Switch
 * Backside), off-axis family with Double/Triple/… from the inversions, degrees rounded to 180,
 * straight flips, straight air / shifty, "Stalled", main grab.
 */
export function trickName(sp: SpinState, switchTakeoff: boolean): TrickInfo {
  const g = mainGrab(sp);
  const grab = g.grab ? GRAB_NAME[g.grab] : null;
  const parts: string[] = [];
  let deg = 0;
  if (sp.mode === 'spin') {
    deg = Math.round(Math.abs(sp.phi) / 180) * 180;
    if (deg === 0) parts.push((switchTakeoff ? 'Switch ' : '') + 'Straight air');
    else {
      if (sp.stalled) parts.push('Stalled');
      parts.push(switchTakeoff ? (sp.dir > 0 ? 'Cab' : 'Switch Backside') : sp.dir > 0 ? 'Frontside' : 'Backside');
      if (sp.tiltType !== 'flat' && sp.inv > 0) {
        const fam = { cork: 'Cork', misty: 'Misty', rodeo: 'Rodeo', flat: '' }[sp.tiltType];
        parts.push(MULT(sp.inv) + fam);
      }
      parts.push(String(deg));
    }
  } else if (sp.mode === 'flip') {
    const n = Math.max(1, Math.round(Math.abs(sp.theta) / 360));
    parts.push(MULT(n) + (sp.dir > 0 ? 'Frontflip' : 'Backflip'));
  } else {
    parts.push((switchTakeoff ? 'Switch ' : '') + (sp.maxShifty > 45 ? 'Shifty' : 'Straight air'));
  }
  if (grab) parts.push(grab);
  return { name: parts.join(' ').replace(/\s+/g, ' ').trim(), deg, grab, grabTime: g.time };
}
