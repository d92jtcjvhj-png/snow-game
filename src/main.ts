import * as THREE from 'three';
import { APPROACH, BOARD, DEG } from './core/config';
import { Input } from './core/input';
import { FixedLoop } from './core/loop';
import { GRAB_NAME } from './physics/spin';
import { initRapier } from './physics/world';
import { FollowCamera } from './render/camera';
import { Markers } from './render/markers';
import { createRenderer } from './render/renderer';
import { createSky } from './render/sky';
import { createSnowMaterial } from './render/snow';
import { Rider, type RiderOutcome } from './render/rider';
import { Spray } from './render/spray';
import { Trails } from './render/trails';
import { createControls } from './ui/controls';
import { createHud, loadAssist } from './ui/hud';
import './ui/style.css';
import { BA, LM, baseY, heightAt, pitchAt } from './world/bigair';
import { Run, type RunInput } from './world/run';
import { buildScene } from './world/scene';
import { buildTerrainGrid } from './world/terrain';

/** which way the rider falls, from the landing cause */
function landOutcome(o: string | undefined): RiderOutcome {
  return o === 'hand' || o === 'twohands' || o === 'buttcheck' ? o : null;
}

function crashDir(cause: string | undefined): 'nose' | 'toe' | 'back' | 'side' {
  if (cause === 'pitchFwd' || cause === 'nose' || cause === 'knuckle' || cause === 'offpiste') return 'nose';
  if (cause === 'edge') return 'toe';
  if (cause === 'backseat' || cause === 'washout') return 'back';
  return 'side';
}

async function main() {
  const canvas = document.getElementById('scene') as HTMLCanvasElement;
  const hudRoot = document.getElementById('hud')!;
  const R = await initRapier();
  const gfx = createRenderer(canvas);
  const grid = buildTerrainGrid();
  const snow = createSnowMaterial(gfx.quality.tier);
  snow.sunDir.copy(gfx.sunDir);
  const world = buildScene(gfx.scene, grid, snow.material);
  const sky = createSky(gfx.sunDir, new THREE.Vector3(0, baseY(LM.zKnuckle), LM.zKnuckle));
  gfx.scene.add(sky.group);
  const onTier = (t: 'low' | 'medium' | 'high') => { snow.setTier(t); world.setTreeCount(t === 'low' ? 90 : t === 'medium' ? 150 : 220); };
  gfx.onTier.push(onTier);
  onTier(gfx.quality.tier);
  const run = new Run(R, grid);
  const rider = new Rider();
  gfx.scene.add(rider.root);
  const spray = new Spray(260);
  gfx.scene.add(spray.points);
  const trails = new Trails(heightAt, 600);
  gfx.scene.add(trails.mesh);
  let wasAir = false;
  const markers = new Markers(gfx.scene);
  const cam = new FollowCamera(heightAt);
  const assist = loadAssist();
  const input = new Input();
  const controls = createControls(hudRoot, input);

  let started = false, cardShown = false;
  let inp: RunInput = { charging: false, charge: 0, axis: 0, brake: 0 };
  const loop = new FixedLoop((dt) => run.step(inp, dt));
  const restart = () => { run.reset(); loop.reset(); cam.snap(); trails.reset(); cardShown = false; hud.hideCard(); };
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
    // in the air the rider's orientation comes from the rotation model (takeoff frame × air rotation)
    const aq = run.airOrientation();
    if (aq) rider.root.quaternion.set(aq.x, aq.y, aq.z, aq.w);
    rider.root.position.copy(pos).addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(rider.root.quaternion), -BOARD.RADIUS);
    const onGround = run.phase !== 'air';
    const charging = run.phase === 'ride' && inp.charging;
    const sp = run.spin, air = run.phase === 'air' && sp;
    let twist = charging ? -Math.sign(inp.charge) * 0.7 * Math.abs(inp.charge) : 0;
    if (air && sp.mode === 'spin') twist = sp.dir * (0.55 * Math.max(0, 1 - sp.airT / 0.45) + Math.min(90, sp.parked) * DEG);
    else if (air && sp.mode === 'none') twist = -sp.shifty * 0.6 * DEG;
    rider.update({
      edge: b.grounded ? b.edge : 0,
      brake: onGround ? inp.brake : 0,
      charge: charging ? Math.abs(inp.charge) : 0,
      twist,
      airborne: !!air,
      // in the air the pose comes from the physics springs (same values that set the inertia)
      airT: air ? sp.airT : 0,
      tuck: air ? sp.tuck : 0,
      open: air ? sp.open : 0,
      grab: air && sp.grabbing ? sp.shape : null,
      outcome: landOutcome(run.landing?.outcome),
      sinceLand: run.landing && run.phase !== 'air' ? run.sinceLanding() : 9,
      crash: run.phase === 'crash' || (run.phase === 'done' && run.landing?.quality === 'crash'),
      crashDir: crashDir(run.landing?.cause),
      absorb: run.landing && run.phase !== 'air' ? Math.min(1, run.landing.efh / 2.5) * Math.max(0, 1 - run.sinceLanding() / 0.3) : 0,
    }, real);

    const bv = b.velocity();
    // snow spray when skidding / speed check
    spray.budget = gfx.quality.tier === 'low' ? 60 : gfx.quality.tier === 'medium' ? 150 : 260;
    trails.budget = gfx.quality.tier === 'low' ? 150 : gfx.quality.tier === 'medium' ? 350 : 600;
    spray.setViewHeight(gfx.renderer.domElement.height);
    const inAir = run.phase === 'air';
    // board tracks: narrow where the edge carves, as wide as the board sweeps when it skids
    if (b.grounded && !inAir && b.speed() > 1.5) {
      const sp = Math.hypot(bv.x, bv.z) || 1, dx = bv.x / sp, dz = bv.z / sp;
      const skid = Math.abs(Math.sin(b.psi - Math.atan2(bv.x, bv.z)));
      trails.add(pos.x, pos.z, dx, dz, 0.09 + BOARD.LENGTH * 0.8 * skid);
    } else trails.lift();
    // landing puff, sized by the impact
    if (wasAir && !inAir && run.landing) spray.burst(pos.x, pos.y, pos.z, bv.x, bv.z, Math.min(1, run.landing.efh / 2.5));
    wasAir = inAir;
    if (b.grounded && (b.skidding || inp.brake > 0.05) && b.speed() > 3) {
      const v = b.velocity(), nE = Math.min(6, Math.round(b.speed() * 0.3 * Math.max(inp.brake, 0.4)));
      for (let i = 0; i < nE; i++) {
        const a = (Math.random() - 0.5) * 1.4;
        spray.emit(pos.x + a * Math.sin(b.psi), pos.y + 0.15, pos.z + a * Math.cos(b.psi), v.x * 0.6 + (Math.random() - 0.3) * 3, 1 + Math.random() * 2.5, v.z * 0.6 + Math.random());
      }
    }
    spray.update(real);

    // training indicators
    const pred = run.phase === 'air' ? run.predict() : null;
    markers.ring.visible = assist.indicators && !!pred;
    if (pred) { landing.set(pred.x, pred.y, pred.z); Markers.place(markers.ring, pred.x, pred.y, pred.z, pitchAt(pred.z)); }
    let msg = '', big = false;
    if (run.phase === 'ride' && started) {
      const v = b.speed(), zIdeal = LM.zLip - v * APPROACH.S_TIME;
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
    cam.update(pos, run.phase === 'air', new THREE.Vector3(bv.x, bv.y, bv.z), real);
    gfx.follow(pos);
    gfx.quality.sample(real);
    // in the air: live trick text, board compass (board vs travel seen from above), "Apri ora!"
    let airHud: { text: string; compassDeg: number | null; upsideDown: boolean; tiltDeg?: number } | null = null;
    if (air && aq) {
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(rider.root.quaternion), up = new THREE.Vector3(0, 1, 0).applyQuaternion(rider.root.quaternion);
      let rel = (Math.atan2(fwd.x, fwd.z) - Math.atan2(bv.x, bv.z)) / DEG;
      rel = ((rel + 540) % 360) - 180;
      const live = sp.mode === 'spin' ? `${Math.round(Math.abs(sp.phi))}°` : sp.mode === 'flip' ? `${Math.round(Math.abs(sp.theta))}°` : '';
      const grabTxt = sp.curGrab ? GRAB_NAME[sp.curGrab] : '';
      airHud = assist.indicators
        ? { text: [live, sp.inv ? `${sp.inv} inv.` : '', grabTxt].filter(Boolean).join(' · '), compassDeg: sp.mode !== 'none' ? rel : null, upsideDown: up.y < 0, tiltDeg: Math.acos(Math.max(-1, Math.min(1, up.y))) / DEG }
        : { text: grabTxt, compassDeg: null, upsideDown: false };
      if (assist.indicators) {
        if (sp.grabbing && sp.apex) { msg = 'Apri ora!'; big = true; }
        else if (!sp.grabbing && !sp.opened && sp.airT < 0.7 && sp.mode !== 'none') msg = 'Grab: tieni un bottone';
      }
    }
    run.tolerance = assist.tolerance;
    hud.update({ speed: b.speed(), edge: b.edge, grounded: b.grounded && run.phase !== 'air', charging, charge: inp.charge, axis: run.axisLatched || inp.axis, msg, bigMsg: big, fps: 1000 / gfx.quality.frameMs, tier: gfx.quality.tier, calls: gfx.renderer.info.render.calls, air: airHud });
    sky.update(cam.camera);
    gfx.renderer.render(gfx.scene, cam.camera);
  });

  // debug handle, like the legacy window.__st
  (window as unknown as { __game: unknown }).__game = { run, gfx, input, LM, DEG };
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML('beforeend', `<pre style="position:fixed;inset:auto 0 0 0;z-index:99;color:#b2321a;background:#fff;padding:8px;white-space:pre-wrap">${String(err)}</pre>`);
});
