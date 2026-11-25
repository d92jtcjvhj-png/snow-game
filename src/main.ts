import * as THREE from 'three';
import { APPROACH, BOARD, DEG } from './core/config';
import { Input } from './core/input';
import { FixedLoop } from './core/loop';
import { initRapier } from './physics/world';
import { FollowCamera } from './render/camera';
import { Markers } from './render/markers';
import { createRenderer } from './render/renderer';
import { Rider } from './render/rider';
import { Spray } from './render/spray';
import { createControls } from './ui/controls';
import { createHud, loadAssist } from './ui/hud';
import './ui/style.css';
import { BA, LM, heightAt, pitchAt } from './world/bigair';
import { Run, type RunInput } from './world/run';
import { buildScene } from './world/scene';
import { buildTerrainGrid } from './world/terrain';

async function main() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const hudRoot = document.getElementById('hud')!;
  const R = await initRapier();
  const gfx = createRenderer(canvas);
  const grid = buildTerrainGrid();
  const tier = gfx.quality.tier;
  buildScene(gfx.scene, grid, tier === 'low' ? 90 : tier === 'medium' ? 150 : 220);
  const run = new Run(R, grid);
  const rider = new Rider();
  gfx.scene.add(rider.root);
  const spray = new Spray(260);
  gfx.scene.add(spray.points);
  const markers = new Markers(gfx.scene);
  const cam = new FollowCamera();
  const assist = loadAssist();
  const input = new Input();
  const controls = createControls(hudRoot, input);

  let started = false, cardShown = false;
  let inp: RunInput = { charging: false, charge: 0, axis: 0, brake: 0 };
  const loop = new FixedLoop((dt) => run.step(inp, dt));
  const restart = () => { run.reset(); loop.reset(); cam.snap(); cardShown = false; hud.hideCard(); };
  const hud = createHud(hudRoot, assist, {
    onStart() { started = true; restart(); },
    onRetry() { restart(); },
    onHelp() { started = false; },
  });
  input.onKey = (code) => {
    if (code === 'KeyR' && started) restart();
    if (code === 'Enter' && !started) document.getElementById('start')!.click();
  };

  gfx.resize(cam.camera);
  addEventListener('resize', () => gfx.resize(cam.camera));

  const pos = new THREE.Vector3(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion();
  const landing = new THREE.Vector3();
  let last = performance.now();
  gfx.renderer.setAnimationLoop((now: number) => {
    const real = Math.min(0.1, (now - last) / 1000);
    last = now;
    inp = input.read(real);
    const b = run.board;
    let alpha = 1;
    if (started && run.phase !== 'done') alpha = loop.advance(real * (assist.slowmo && run.phase === 'air' ? 0.5 : 1));
    if (run.phase === 'done' && started && !cardShown) { cardShown = true; hud.showCard(run.takeoff, run.landing, run.note); }

    // interpolated pose
    const p = b.position(), r = b.rotation();
    pos.set(b.prevPos.x, b.prevPos.y, b.prevPos.z).lerp(new THREE.Vector3(p.x, p.y, p.z), alpha);
    qa.set(b.prevRot.x, b.prevRot.y, b.prevRot.z, b.prevRot.w);
    qb.set(r.x, r.y, r.z, r.w);
    rider.root.quaternion.slerpQuaternions(qa, qb, alpha);
    rider.root.position.copy(pos).addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(rider.root.quaternion), -BOARD.RADIUS);
    const onGround = run.phase === 'ride' || run.phase === 'landed';
    const charging = run.phase === 'ride' && inp.charging;
    rider.update({
      edge: b.grounded ? b.edge : 0,
      crouch: run.phase === 'air' ? 0.5 : charging ? 0.7 : Math.min(0.6, inp.brake),
      twist: charging ? -Math.sign(inp.charge) * 0.7 * Math.abs(inp.charge) : 0,
      arms: charging ? Math.abs(inp.charge) : 0,
      airborne: run.phase === 'air',
    }, real);

    // snow spray when skidding / speed check
    spray.budget = gfx.quality.tier === 'low' ? 60 : gfx.quality.tier === 'medium' ? 150 : 260;
    if (b.grounded && (b.skidding || inp.brake > 0.05) && b.speed() > 3) {
      const v = b.velocity(), nE = Math.min(6, Math.round(b.speed() * 0.3 * Math.max(inp.brake, 0.4)));
      for (let i = 0; i < nE; i++) {
        const a = (Math.random() - 0.5) * 1.4;
        spray.emit(pos.x + a * Math.sin(b.psi), pos.y, pos.z + a * Math.cos(b.psi), v.x * 0.6 + (Math.random() - 0.3) * 3, 1 + Math.random() * 2.5, v.z * 0.6 + Math.random());
      }
    }
    spray.update(real);

    // training indicators
    const pred = run.phase === 'air' ? run.predict() : null;
    markers.ring.visible = assist.indicators && !!pred;
    if (pred) { landing.set(pred.x, pred.y, pred.z); Markers.place(markers.ring, pred.x, pred.y, pred.z, pitchAt(pred.z)); }
    let msg = '', big = false;
    if (run.phase === 'ride' && started) {
      const v = b.speed(), zIdeal = BA.kickerBase - v * APPROACH.S_TIME;
      const showBand = assist.indicators && !run.approach.active && p.z < zIdeal + 4;
      markers.band.visible = showBand;
      if (showBand) Markers.place(markers.band, 0, heightAt(0, zIdeal), zIdeal, pitchAt(zIdeal));
      if (run.note) msg = run.note;
      else if (run.approach.active) msg = p.z < BA.kickerBase ? (run.approach.timing > APPROACH.ON_TIME ? 'Troppo presto!' : run.approach.timing < -APPROACH.ON_TIME ? 'Tardi!' : 'Curva d’impostazione…') : 'Stacca il pollice sul labbro (linea blu)';
      else if (p.z < BA.kickerBase - 70) msg = 'Speed check a destra per regolare la velocità';
      else if (assist.indicators && Math.abs(p.z - zIdeal) < v * APPROACH.ON_TIME) { msg = 'Carica ora!'; big = true; }
      else if (p.z < zIdeal) msg = assist.indicators ? 'Appoggia il pollice sulla linea gialla' : 'Pollice sinistro: carica e inizia la curva';
    } else markers.band.visible = false;

    controls.setGround(onGround);
    controls.barKnob(input.keyboardCharging && run.phase === 'ride' ? inp.charge : null);
    cam.update(pos, run.phase === 'air', pred ? landing : null, real);
    gfx.follow(pos);
    gfx.quality.sample(real);
    hud.update({ speed: b.speed(), edge: b.edge, grounded: b.grounded && run.phase !== 'air', charging, charge: inp.charge, axis: inp.axis, msg, bigMsg: big, fps: 1000 / gfx.quality.frameMs, tier: gfx.quality.tier });
    gfx.renderer.render(gfx.scene, cam.camera);
  });

  // debug handle, like the legacy window.__st
  (window as unknown as { __game: unknown }).__game = { run, gfx, input, LM, DEG };
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;inset:auto 0 0 0;z-index:99;color:#b2321a;background:#fff;padding:8px;white-space:pre-wrap">${String(err)}</pre>`);
});
