import { FixedLoop } from './core/loop';
import { initRapier } from './physics/world';
import { FollowCamera } from './render/camera';
import { createRenderer } from './render/renderer';
import { createHud } from './ui/hud';
import { createGameWorld } from './world/scene';

async function main() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const R = await initRapier();
  const gfx = createRenderer(canvas);
  const world = createGameWorld(R, gfx.scene);
  const cam = new FollowCamera();
  const loop = new FixedLoop((dt) => world.step(dt));

  const reset = () => { world.cube.reset(); loop.reset(); cam.snap(); };
  const hud = createHud(document.getElementById('hud')!, reset);

  gfx.resize(cam.camera);
  window.addEventListener('resize', () => gfx.resize(cam.camera));

  let last = performance.now();
  gfx.renderer.setAnimationLoop((now: number) => {
    const real = (now - last) / 1000;
    last = now;
    const alpha = loop.advance(real);
    world.sync(alpha);
    cam.update(world.cubeMesh.position, Math.min(real, 0.05));
    gfx.follow(world.cubeMesh.position);
    gfx.quality.sample(real);
    hud.update(world.cube.speed(), 1000 / gfx.quality.frameMs, gfx.quality.tier);
    gfx.renderer.render(gfx.scene, cam.camera);
  });

  // debug handle, like the legacy window.__st
  (window as unknown as { __game: unknown }).__game = { world, gfx };
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;inset:auto 0 0 0;color:#b2321a;background:#fff;padding:8px;white-space:pre-wrap">${String(err)}</pre>`);
});
