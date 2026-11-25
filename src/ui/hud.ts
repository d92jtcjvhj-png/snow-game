import { MS_TO_KMH } from '../core/config';

const CSS = `
#hud{position:fixed;inset:0;pointer-events:none;font:600 14px/1.3 system-ui,sans-serif;color:#f4f8fc}
#hud .row{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));left:calc(12px + env(safe-area-inset-left,0px));
  right:calc(12px + env(safe-area-inset-right,0px));display:flex;gap:8px;align-items:flex-start}
#hud .pill{background:rgba(15,26,43,.55);border-radius:12px;padding:6px 10px}
#hud .spd b{display:block;font-size:28px;line-height:1}
#hud .spd small,#hud .dbg{font-size:11px;opacity:.8;letter-spacing:.04em}
#hud button{pointer-events:auto;margin-left:auto;min-width:72px;height:44px;border:0;border-radius:12px;
  background:#ff5a36;color:#fff;font:800 16px system-ui,sans-serif;text-transform:uppercase;cursor:pointer}
`;

export interface Hud {
  update(speed: number, fps: number, tier: string): void;
}

/** Minimal HUD: speed (km/h), fps + quality tier, Reset button (also key R). */
export function createHud(root: HTMLElement, onReset: () => void): Hud {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);
  root.innerHTML = `<div class="row">
    <div class="pill spd"><b id="hSpd">0</b><small>KM/H</small></div>
    <div class="pill dbg" id="hDbg"></div>
    <button id="hReset" type="button">Reset</button></div>`;
  const spd = root.querySelector<HTMLElement>('#hSpd')!;
  const dbg = root.querySelector<HTMLElement>('#hDbg')!;
  root.querySelector('#hReset')!.addEventListener('click', onReset);
  window.addEventListener('keydown', (e) => { if (e.code === 'KeyR') onReset(); });
  let t = 0;
  return {
    update(speed, fps, tier) {
      spd.textContent = String(Math.round(speed * MS_TO_KMH));
      if ((t = (t + 1) % 15) === 0) dbg.textContent = `${Math.round(fps)} fps · qualità ${tier}`;
    },
  };
}
