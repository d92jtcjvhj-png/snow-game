import { describe, expect, it } from 'vitest';
import { initSpin } from '../src/physics/spin';
import { trickName } from '../src/world/trickName';

describe('trick names', () => {
  it('flat spin with a grab', () => {
    const sp = initSpin(0.6, 1, 0, 1, null);
    sp.phi = 715; sp.grabTimes = { indy: 0.6 };
    expect(trickName(sp, false).name).toBe('Frontside 720 Indy');
  });
  it('off-axis with inversions', () => {
    const sp = initSpin(0.6, -1, 1, 1, null);
    sp.phi = -1075; sp.inv = 2;
    expect(trickName(sp, false).name).toBe('Backside Double Cork 1080');
  });
  it('switch directions: Cab and Switch Backside', () => {
    const fs = initSpin(0.4, 1, 0, 1, null); fs.phi = 540;
    const bs = initSpin(0.4, -1, 0, 1, null); bs.phi = -360;
    expect(trickName(fs, true).name).toBe('Cab 540');
    expect(trickName(bs, true).name).toBe('Switch Backside 360');
  });
  it('flips, stalled, short grabs ignored', () => {
    const f = initSpin(0, 0, -1, 1, null); f.theta = -365;
    expect(trickName(f, false).name).toBe('Backflip');
    const st = initSpin(0.5, 1, 0, 1, null); st.phi = 540; st.stalled = true; st.grabTimes = { mute: 0.1 };
    expect(trickName(st, false).name).toBe('Stalled Frontside 540');
  });
});
