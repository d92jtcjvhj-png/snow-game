# Snow terrain, sky, lighting and atmosphere in three.js r187 (realistic-stylized, 60 fps on mid-range phones)

How these notes were made: in this session the network blocked direct page fetches (WebFetch failed DNS for discourse.threejs.org, threejs.org, alanzucconi.com and developer.arm.com). Web findings therefore come from **search-result snippets**. Facts about three.js r187 were **checked directly in the installed package** (`node_modules/three`, version 0.187.0, pinned in `package.json`). Those citations point at the local file path, which is a primary source for this exact version.

Tier tags used below: **[L]** low, **[M]** medium, **[H]** high (they match `src/render/quality.ts`: low = pixel ratio 1 and no shadows, medium = 1.5 and no shadows, high = 2 and 2048 shadows).

Current project state: `src/render/renderer.ts` sets `renderer.shadowMap.type = THREE.PCFSoftShadowMap`. It also uses `HemisphereLight(0xffffff, 0x7f97b2, 1.6)`, a `DirectionalLight` at 2.2, linear `Fog(0xd6e6f2, 70, 320)` and a flat background colour. `src/render/materials.ts` uses `MeshLambertMaterial({ flatShading: true })` for everything.

---

## 1. Snow shading (normals, material model, SSS/wrap, blue shadows, sparkle, slope tint, corduroy/grain, trails)

### Takeaway
Use smooth analytic normals on the terrain only. Rule 2 asks for flat shading, so this needs a decision: smooth normals for the snow, facets for props. Shade the snow with a patched `MeshLambertMaterial`, or a small custom shader, that adds wrap diffuse, a blue sky-tinted shadow and ambient, a rare-and-bright noise sparkle, slope tinting and procedural corduroy. Skip `MeshStandardMaterial`/PBR on the terrain. Trails should be a cheap ribbon mesh [L/M] or a small ping-pong render target around the rider [H].

### Cited Findings
- **Wrap lighting (fake SSS).** GPU Gems ch.16 (Simon Green): wrap lighting changes the diffuse term so light carries on past the terminator. The formula is `max(0, (N·L + wrap) / (1 + wrap))` with wrap in 0..1. Because it is a function of a single dot product, it can also be baked into a lookup texture. Adding a colour shift where lighting nears zero (red for skin) cheaply suggests scattering. The chapter also calls wrap lighting a crude approximation of Oren-Nayar for rough matte surfaces — [GPU Gems ch.16](https://developer.nvidia.com/gpugems/gpugems/part-iii-materials/chapter-16-real-time-approximations-subsurface-scattering). (The search summary warns that the shader listing on NVIDIA's page is partly garbled.)
- **Stylized snow recipes** in other engines combine "specular with noise, rim light, fake scattering on top border, bump, fresnel" — [Unity forum: Stylized Snow shader](https://discussions.unity.com/t/stylized-snow-shader/491952). An Unreal Engine 5 breakdown uses Fresnel to brighten snow at grazing angles, which makes it look softer and more translucent at the edges — [80.lv UE5 snow shader](https://80.lv/articles/setting-up-a-detailed-snow-shader-in-unreal-engine-5).
- **Snow albedo.** Fresh snow is about 0.9 in visible light and about 0.8 broadband, because near-IR absorption lowers the broadband value — [Wikipedia: Albedo](https://en.wikipedia.com/wiki/Albedo) (a .com mirror), [NASA Earthdata: albedo](https://earthdata.nasa.gov/topics/land-surface/albedo), [Kokhanovsky, Frontiers 2021](https://frontiersin.org/articles/10.3389/fenvs.2021.757575/full).
- **Glitter, from Journey (GDC 2013, John Edwards, "Sand Rendering in Journey").** Glitter is a separate specular term among six sand shading components — [Polycount summary](https://polycount.com/discussion/125544/the-technical-art-behind-journey), [GDC Vault](https://gdcvault.com/play/1017742/Sand-Rendering-in). In Alan Zucconi's reconstruction, each grain gets a random normal drawn from a Gaussian-distributed random texture, so it acts as a tiny mirror. The glitter is meant to be rare and very bright, and it sits on top of the ocean-specular term — [Zucconi, Journey sand shader pt.5](https://www.alanzucconi.com/2019/10/08/journey-sand-shader-5/) (snippet only; the page could not be fetched).
- Real sand and snow need sparkles in several sizes — [Polycount desert thread](https://polycount.com/discussion/comment/2621156). Sparkle textures should have mipmapping disabled, because mips blur the sparkles away at distance — [Interactive Snow w/ Tesselation (Patreon)](https://www.patreon.com/posts/interactive-snow-25641162). A Terragen artist found that anti-aliasing blurs glitter, so reflectivity has to be pushed high — [Planetside forum, arctic glitter](https://planetside.co.uk/forums/index.php?msg=208701).
- There is an npm package `three-glitter-material` (extends Phong, uniforms for flake size and density) — [npm](https://npmjs.com/package/three-glitter-material). It is only a reference: rule 10 and the no-new-dependency constraint argue against installing it.
- **Snow trails / deformation.**
  - The common approach is a render target used as a mask or heightmap. A scene capture overwrites its target every frame, so trails only persist with ping-pong between two targets — [Kodeco: Snow Trails in UE4](https://www.kodeco.com/196937/creating-snow-trails-in-unreal-engine-4), [page 3](https://kodeco.com/5760-creating-snow-trails-in-unreal-engine-4?page=3).
  - Batman: Arkham Origins drew snow-affecting actors from below with an ankle-high orthographic frustum, accumulated them with ping-pong filtering, then used relief mapping or tessellation — [GDC 2014 deformable snow](https://www.slideshare.net/colinbb/gdc2014-deformable-snow-rendering-in-batman-arkham-origins).
  - Vertex-shader variant: map world position into the UV of a deformation texture and push vertices down — [IndieDB snow deformation](https://www.indiedb.com/news/snow-deformation-november-28-2019).
  - Compute variant: R channel = depth, G channel = pile-up rim — [lillabofinken Snow Deformation](https://lillabofinken.github.io/1_SnowDeformation.html).
  - An Unreal forum thread discusses why trails behave differently on PC and mobile — [UE forum](https://forums.unrealengine.com/t/snow-mud-trails-explanation-of-pc-mobile-differences/478309.md) (title only, not read).
- **three.js r187 API checks (local source):**
  - `Material.dithering` exists (default false) and removes banding — `node_modules/three/src/materials/Material.js` line ~394.
  - `examples/jsm/math/SimplexNoise.js` and `ImprovedNoise.js` exist for CPU-side noise (AO, vertex colours, prop placement).

### Inferences
- **Normals.** The height field is analytic, so compute `n = normalize(-∂h/∂x, 1, -∂h/∂z)` on the CPU per vertex and store it in the `normal` attribute. Smooth shading is then free and does not depend on mesh resolution. It is also consistent with the physics, which already uses h(x,z). Flat shading on a large slope makes visible triangle "terraces" and costs the same. **Rule 2 says flat shading, so this needs the user's decision.** One option: smooth terrain plus faceted props/trees keeps the low-poly identity. [L/M/H]
- **Material choice.** `MeshLambertMaterial` in r187 is evaluated per fragment, but the shader is far cheaper than `MeshStandardMaterial`, which needs GGX, the PMREM env path and more uniforms. Snow is nearly Lambertian with a broad forward/back lobe, so Lambert plus a few added terms is the right base. Patch it with `onBeforeCompile` (inject after `#include <lights_fragment_end>` or replace `<lights_lambert_pars_fragment>`), or write one small `ShaderMaterial` with `UniformsLib.lights` and `fog`. **Cost: low (a handful of ALU ops).** [L/M/H]
- **Wrap diffuse.** wrap ≈ 0.3–0.5 on the sun term, multiplied by a slightly blue "scatter" tint near the terminator (the snow version of the skin "red shift"). Cost: 2 ALU ops. [L/M/H]
- **Blue shadows and ambient.**
  - Set the HemisphereLight sky colour to a sky blue (about `#9cc4ff` in linear terms) and the ground colour to a bounce white-blue (about `#dfe8f5`). Snow bounces about 0.8–0.9 of the light, so the ground term should be bright, not dark.
  - Set the sun to warm white (`#fff1dc`, as now).
  - Shadowed areas then read blue automatically, because only the hemisphere term lights them.
  - Set snow albedo to about 0.85–0.9 (`#e6eef7`-ish in sRGB) rather than `#ffffff`, so sun × albedo stays below the tone-mapper shoulder (see §4).
  - [L/M/H], zero cost.
- **Sparkle (view-dependent, no texture).**
  1. In the fragment shader, hash the world position quantised to a grain cell, e.g. `floor(worldPos.xz * 40.0)`, into a random unit vector g. Optionally use 2 cell sizes for the multi-size look.
  2. Perturb: `n' = normalize(n + g*0.6)`.
  3. Compute `s = pow(max(dot(reflect(-V, n'), L), 0.0), 400.0)` and threshold it with `step(0.995, …)` or `smoothstep`.
  4. Fade by distance (`smoothstep(30.0, 5.0, viewDist)`) to avoid shimmer and aliasing, and multiply by the sun shadow factor.
  - Output HDR (×4–10) so bloom catches it on [H].
  - Because it is procedural, the mip problem does not arise. The equivalent issue is sub-pixel aliasing, which the distance fade handles.
  - Cost: 1 hash + 1 pow, about 15 ALU ops. [M/H]; off on [L].
- **Slope tinting (rock or ice on steep faces).** `t = smoothstep(0.65, 0.5, n.y)` blends to the rock palette colour (`PALETTE.rock`). Better: precompute it per vertex on the CPU from the analytic slope into a vertex colour, which costs nothing at runtime. The big-air takeoff and landing are steep but snow-covered, so use a world-space mask so that only off-piste cliffs get rock. [L/M/H]
- **Corduroy and grain.**
  - Corduroy is a periodic ridge pattern along the fall line: `c = 0.5 + 0.5*sin(dot(worldPos.xz, perpFallLine) * 2π / 0.025m)` modulating the normal slightly (normal perturbation along perpFallLine) or the albedo by ±3%.
  - Grooming lines are about 2–3 cm apart (common knowledge; I found no source). At game camera distances that is sub-pixel, so use a stylized 10–20 cm period and fade it out beyond about 20 m to avoid moiré.
  - Grain: one value-noise octave on the albedo (±2%).
  - Cost: 1 sin + 1 noise. [M/H]; [L] = albedo-only corduroy without normal perturbation, or none.
  - Alternative: a tiny tiled 64×64 RG normal texture with mipmaps. Mipmaps fix the moiré for free, but it costs one texture fetch.
- **Trails.**
  - [L/M]: a CPU ribbon. Append board-edge vertex pairs every N cm to a ring-buffer `BufferGeometry` (about 512 segments), lay it on h(x,z)+1 cm, and colour it slightly darker/bluer with `polygonOffset`. It costs one draw call, no render target, and is deterministic and testable.
  - [H]: a 256² ping-pong `WebGLRenderTarget` (`HalfFloatType` or `UnsignedByte` RG), an orthographic top-down capture centred on the rider, scrolled with the rider. The terrain shader samples it to darken the albedo, perturb normals and optionally displace. That is 2 extra passes at 256², very small.

### Gaps
- No measured numbers (ms) for these snow terms on a specific phone GPU. Profile on device.
- Could not read Zucconi's full glitter code or the Journey slides (fetch blocked). The sparkle formula above is a reconstruction from the snippets plus standard Blinn/Phong practice.
- No source found for a stylized corduroy period. The 2–3 cm groomer spacing is uncited.

---

## 2. Lighting (sun + hemisphere, mobile shadows, baked AO, blob shadow)

### Takeaway
Use one DirectionalLight with a single tight shadow frustum that follows the rider (already done in `follow()`), PCF at 1024 on [M] and 2048 on [H]. Do not use cascades. Note that **PCFSoftShadowMap no longer exists in r187** (it falls back to PCF with a warning). Bake terrain AO on the CPU from h(x,z) into vertex colours on all tiers. Use a blob shadow decal on [L], where shadow maps are off.

### Cited Findings
- **r187 source:** `WebGLShadowMap.js` default `type = PCFShadowMap`. On render: `if (this.type === PCFSoftShadowMap) { warn('WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.'); this.type = PCFShadowMap; }` — `node_modules/three/src/renderers/webgl/WebGLShadowMap.js` lines 88–103. **The project's `renderer.ts` therefore triggers this warning and gets PCF anyway.**
- **r187 PCF** uses `sampler2DShadow` ("Hardware PCF with LinearFilter gives us 4-tap filtering per sample") — `src/renderers/shaders/ShaderChunk/shadowmap_pars_fragment.glsl.js` lines ~150–171. `LightShadow` has `radius` (default 1), `blurSamples` (default 8, VSM) and `intensity` (default 1) — `src/lights/LightShadow.js`. `shadow.intensity < 1` gives lighter shadows for free.
- **VSM** in r187 requires receivers to also render into the shadow pass (`object.castShadow || (object.receiveShadow && type === VSMShadowMap)`) and adds a blur pass — `WebGLShadowMap.js` line ~528. The extra passes and float/half-float RG targets mean more bandwidth.
- **Shadows on mobile (Arm, SIGGRAPH 2016).**
  - Cascaded shadow maps re-render geometry N times. Geometry shaders are not efficient on mobile.
  - Exponential VSM fixes most light bleeding but works best with 32-bit float textures, which costs bandwidth.
  - Sample-distribution shadow maps were practical on mobile.
  - Source: [Arm SIGGRAPH 2016 shadows talk (PDF)](https://community.arm.com:443/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/3_2D00_mmg_2D00_siggraph2016_2D00_shadows_2D00_marius.pdf) (snippet).
- The Arm SIGGRAPH 2018 deck turned directional-light shadows off in its test scene to avoid rendering overhead — [Arm SIGGRAPH 2018 PDF](https://community.arm.com:443/cfs-file/__key/communityserver-blogs-components-weblogfiles/00-00-00-20-66/5127.siggraph_2D00_2018_2D00_mmg_2D00_3_2D00_rendering_2D00_hanskristian.pdf). (Midgard-era. The deck itself says Bifrost differs.)
- Tile-based GPUs keep fragment work in tile memory and write out only at the end. Load/store choices matter for bandwidth — [Arm Vulkan best practice samples](https://community.arm.com/developer/tools-software/graphics/b/blog/posts/vulkan-samples). The main reference is the Mali Best Practices guide (Valhall and earlier) — [Arm Mali best practices](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/arm-mali-best-practices).

### Inferences
- **Shadow setup.**
  - Keep `PCFShadowMap` and fix the code to stop requesting `PCFSoftShadowMap`.
  - Keep the ortho box tight, about ±12–20 m (now ±20 m), centred on the rider. Snap the box centre to shadow-texel increments to stop shimmering as it moves.
  - Shadow casters: only rider, trees and rocks near the rider. Do not let the terrain cast. It is a smooth height field with a high sun, and self-shadowing from terrain is better handled by baked AO or a baked "horizon" term.
  - Use `renderer.shadowMap.autoUpdate = true` only for the dynamic area. Static props are fine since the frustum moves anyway.
  - Costs: [M] 1024² PCF (consider turning on for [M], which is currently off) — about 1 extra depth pass of a few hundred triangles plus 4 hardware taps per fragment. [H] 2048² PCF, radius 2–3.
- **Cascades:** not worth it. Big-air framing is mostly a medium-distance chase cam, and distant objects can do without shadows (fog plus AO).
- **Baked terrain AO / horizon (CPU, once).**
  - For each vertex, sample h along 8 azimuths at 3–4 distances (e.g. 1, 3, 8, 20 m), compute the max elevation angle, and set `ao = 1 − mean(sin(horizonAngle))`.
  - Store it in the `color` attribute (`vertexColors: true`) together with the slope tint.
  - This is deterministic, testable in Vitest (pure function of h), and costs zero at runtime. [L/M/H]
  - It also gives "sky visibility" to scale the hemisphere term, so gullies and the landing knuckle get bluer.
- **Blob shadow [L] (and [M] if shadows stay off).**
  - Use a single quad with a radial-gradient alpha, or compute it procedurally with `1 - smoothstep(0, r, length(uv))` (no texture). Place it at h(x,z) under the rider and orient it to the analytic normal.
  - Scale and fade it with rider height above the snow. That gives an important depth cue in the air, which matters for landing timing.
  - Use `depthWrite: false`, `polygonOffset`. Cost: one tiny transparent draw.

### Gaps
- I found no recent Arm/Adreno/Apple numbers for PCF vs VSM cost at specific resolutions. The Arm Mali guide could not be fetched.
- I did not verify whether r187's PCF `radius` > 1 increases the tap count (I read only the header lines of the shadow chunk).

---

## 3. Sky and atmosphere (Sky addon, gradient dome, fog, mountain silhouettes, sun disc)

### Takeaway
On a phone, avoid the r187 `Sky` addon at full resolution every frame. In r187 it now also runs 4-octave fbm clouds per pixel. Use a custom gradient dome shader (a few ALU ops) whose horizon colour equals the fog colour, plus an analytic sun disc and glow. Patch fog to add a height falloff, and use 2–3 layers of low-poly mountain silhouettes tinted by distance. Option: render `Sky` once into a small cube or equirect texture, but a gradient is cheaper and more on-style.

### Cited Findings
- **r187 `Sky`** (`examples/jsm/objects/Sky.js`):
  - Preetham analytic daylight model, BackSide `BoxGeometry` with `ShaderMaterial`, `depthWrite: false`. WebGL only; use `SkyMesh` for WebGPU.
  - Uniforms include turbidity, rayleigh, mie, sunPosition, `showSunDisc` and new cloud uniforms (`cloudScale`, `cloudSpeed`, `cloudCoverage` default 0.4, `cloudDensity`, `cloudElevation`, `time`).
  - The fragment shader runs a 4-octave `fbm` for clouds when `direction.y > 0 && cloudCoverage > 0`. **Setting `cloudCoverage = 0` skips the cloud branch.**
  - The sun disc is `clamp((cosTheta - sunAngularDiameterCos)*50000.0, 0, 1)`.
  - Source: local file lines 1–60, 74–100, 200–310.
  - The output is HDR (radiance × 0.04 scale), so it relies on tone mapping and exposure.
- **r187 built-in fog**: `FogExp2` `fogFactor = 1 - exp(-d² · z²)`; linear `Fog` `smoothstep(near, far, z)`; result `mix(color, fogColor, fogFactor)`. z is view depth only, with no height term — `src/renderers/shaders/ShaderChunk/fog_fragment.glsl.js`.
- **Height fog / custom fog.**
  - Standard fog measures full 3D camera distance, so density shifts when the camera moves vertically. XZFog patches materials via `onBeforeCompile` to use ground-plane distance — [three.js forum: XZFog](https://discourse.threejs.org/t/xzfog-horizontal-distance-fog-for-three-js-top-down-isometric-games/87619).
  - A height-based ground fog post advises patching only the materials that need it, to save compile time — [three.js forum: High-Performance Ground Fog](https://discourse.threejs.org/t/high-performance-ground-fog-for-games-three-js/88522).
  - A common error is using `worldPosition` in the vertex shader without declaring it — [three.js forum: Shader error fog height](https://discourse.threejs.org/t/shader-error-fog-height/38665).
- Rayleigh scattering is why noon skies are blue and sunsets red — [Godot Shaders: Freeman's Sky](https://godotshaders.com/?p=16185) (background only).

### Inferences
- **Gradient sky dome [L/M/H].**
  - Use a large sphere with low segments (16×8, BackSide, `depthWrite: false`, `fog: false`, rendered first or with `renderOrder = -1`).
  - Fragment: `t = clamp(dir.y, 0, 1)`; `col = mix(horizon, zenith, pow(t, 0.5))`.
  - Add the sun: `glow = pow(max(dot(dir, sunDir), 0), 8) * glowCol + smoothstep(cosR - 0.0005, cosR, dot(dir, sunDir)) * discCol`, with discCol in HDR (>1) so it blooms on [H].
  - Cost: about 10 ALU ops per sky pixel, no textures. Compared with Preetham + fbm clouds it is far cheaper, and it fits the pastel palette.
  - Set `horizon` to exactly `scene.fog.color`, so distant terrain merges into the sky with no seam.
  - Optional [H]: 1 noise octave for high cirrus streaks.
- **Using `Sky` anyway [H only].** Set `cloudCoverage = 0`, render it into a 128–256 px `WebGLCubeRenderTarget` with `CubeCamera` once (sun is static), and use it as `scene.background`. Then the per-frame cost is one cube fetch. Read the fog colour from the horizon sample so they match.
- **Height + distance fog [M/H]; [L] built-in linear `Fog`.**
  - Patch the fog chunk via `onBeforeCompile` (pass a `vWorldY` varying): `f = (1 - exp(-density·dist)) * exp(-max(worldY - fogBase, 0) * falloff)`.
  - This keeps valley haze while the kicker and summit stay crisp. Cost: 1 exp more.
  - Patch only the terrain, prop and silhouette materials (one shared material reuses one program).
- **Mountain silhouettes [L/M/H].**
  - Use 2–3 concentric ring meshes at 600–2000 m. The ridge profile comes from 1D noise on the CPU (ImprovedNoise/SimplexNoise in `examples/jsm/math`), with about 64–128 vertices per ring and snow caps via vertex colour above a height.
  - Colour each layer by aerial perspective, pre-mixed towards the fog/horizon colour on the CPU (far layer about 80% fog colour). Use `fog: false`, so there are no per-fragment fog costs.
  - That is 1–3 draw calls, all opaque, with no overdraw issues. It follows rule 7 (geometry from data).
- **Sun.** Keep the DirectionalLight direction equal to the dome `sunDir`, so the glints (§1) line up with the visible sun.

### Gaps
- I did not measure the Sky.js cost in ms on mobile. The "avoid" advice is based on the per-pixel Preetham math plus 4-octave fbm, read from the source.
- I could not read the three.js forum fog posts in full (fetch blocked). Only snippets were used.

---

## 4. Tone mapping and colour (ACES vs AgX vs Neutral, sRGB output, exposure, white clipping)

### Takeaway
Use `NeutralToneMapping` (Khronos PBR Neutral) or `AgXToneMapping`. Do not use ACESFilmic for snow: it pushes bright blue-whites to cyan or flat white and shifts hues. Keep `outputColorSpace = SRGBColorSpace` (default). Set albedo ≈ 0.85–0.9 and sun intensity so that sunlit snow lands at about 0.8–0.9 display value, and keep HDR > 1 only for sparkles and the sun disc.

### Cited Findings
- **r187 constants:** `NoToneMapping 0, Linear 1, Reinhard 2, Cineon 3, ACESFilmic 4, Custom 5, AgX 6, Neutral 7` — `node_modules/three/src/constants.js` lines 423–483. AgX is "based on Filament, which in turn is based on Blender's implementation using rec 2020 primaries… Inputs and outputs are encoded as Linear-sRGB" — `src/renderers/shaders/ShaderChunk/tonemapping_pars_fragment.glsl.js` line ~108.
- **Saturation:** AgX Base is less saturated than ACES Filmic by design. A scene lit for ACES won't immediately look better with AgX — [three.js forum: Is AgX implemented correctly?](https://discourse.threejs.org/t/is-agx-tonemapping-implemented-correctly/60609) (snippet).
- **Gamut mapping:** three.js AgX gained a gamut-mapping step for out-of-gamut Rec.2020 → Rec.709 pixels. The tone mappers target LDR displays — [three.js PR #27413](https://github.com/mrdoob/three.js/pull/27413) (snippet).
- **Neutral:** NEUTRAL is the Khronos PBR Neutral mapper, added in r162. One forum user preferred it in side-by-side tests — [three.js forum: Tone Mapping Overview](https://discourse.threejs.org/t/tone-mapping-overview/75204) (snippet).
- **ACESFilmic** in three.js uses a 1/0.6 exposure scale — [pmndrs postprocessing docs](https://pmndrs.github.io/postprocessing/public/docs/file/src/enums/ToneMappingMode.js.html), [three.js forum: Pmndrs tone mapping guidance](https://discourse.threejs.org/t/pmndrs-post-processing-tone-mapping-guidance/59374/2).
- **Hue shift:** ACES shifts hues as colours blow out, while AgX moves them toward white more gracefully. A Unity forum post reports ACES clipping some blues — [Unity Discussions: better tonemappers](https://discussions.unity.com/t/unity-needs-better-tonemappers-especially-for-hdr/1693305). (These are other-engine and partly LinkedIn sources, so treat them as indicative.)
- Interactive comparison of GLSL tone-map curves — [glsl-tone-map](https://dmnsgn.github.io/glsl-tone-map).
- Separate report: ACESFilmic leading to low-contrast textures — [three.js forum](https://discourse.threejs.org/t/acesfilmictonemapping-leading-to-low-contrast-textures/15484).

### Inferences
- **Pastel cartoon palette:** Neutral keeps hues close to authored colours with a soft shoulder only near white, so it is best for keeping `materials.ts` colours recognisable. AgX gives the most filmic highlight roll-off (sun glare, glints) but desaturates pastels, which would need retuning of colours or a saturation lift via LUT [H].
- **Where tone mapping runs.** With no post-processing, the built-in tone mapping runs in each material's fragment shader, which is zero extra passes. With an EffectComposer, put `OutputPass` (tone map + sRGB) last ([§5](#5-post-processing-on-mobile)).
- **Avoiding white clipping.**
  1. Snow albedo ≈ 0.85–0.9 (not 1.0).
  2. Tune `sunIntensity × albedo × N·L + hemi` so that flat sunlit snow is about 1.0–1.5 linear before the tone map. With Neutral that maps to about 0.85–0.95.
  3. Make shadows clearly blue, not grey, so the eye reads "white".
  4. Use `toneMappingExposure` as the single global knob.
  5. Turn on `material.dithering = true` on the sky and terrain to remove banding in the smooth gradients (cheap).
- This needs a visual A/B in the real scene. No source gives a definitive answer for snow.

### Gaps
- I found no source that quantifies white clipping per tone mapper in three.js. The recommendation rests on curve shape plus the snippets.

---

## 5. Post-processing on mobile

### Takeaway
On [L]/[M], use **no EffectComposer** (built-in tone mapping, MSAA from the context, or none). On [H], an optional composer with low-res bloom (sun disc, glints), FXAA (or keep MSAA), and a vignette and colour grade folded into the final pass. SSAO, SSR, GTAO, DOF and TAA are out on phones. A reduced pixel ratio is the biggest lever.

### Cited Findings
- **r187 addons present** (`examples/jsm/postprocessing/`): `UnrealBloomPass`, `BloomPass`, `FXAAPass`, `SMAAPass` (3 shader passes: edges, weights, blend), `LUTPass`, `OutputPass`, `GTAOPass`, `SSAOPass`, `SAOPass`, `SSRPass`, `TAARenderPass`, `BokehPass` and others. Shaders include `VignetteShader`, `FXAAShader`, `SMAAShader` — local directory listing.
- **Bloom cost:** one report found an Intel MacBook Pro barely above 20 fps with the bloom example until the canvas was shrunk to about 400 px wide, while an M1 Air held 60 fps — [three.js forum: UnrealBloomPass poor performance](https://discourse.threejs.org/t/unrealbloompass-poor-performance-on-macos-safari-with-intel/42606).
- **Arm:** blur needs neighbouring pixels, which fits tile-based GPUs poorly. Arm suggests building glow into material shaders instead of a separate pass — [Arm: post-processing effects on mobile](https://developer.arm.com/community/arm-community-blogs/b/mobile-graphics-and-gaming-blog/posts/post-processing-effects-on-mobile-optimization-and-alternatives) (snippet).
- **Pixel ratio:** a thread advises against changing pixel ratio continuously from FPS because it oscillates and looks unstable. Another user saw large gains dropping to 1 — [three.js forum: Changing pixelRatio based on fps](https://discourse.threejs.org/t/changing-pixelratio-based-on-fps-good-or-bad-idea/34563), [Low fps on iOS with devicePixelRatio](https://discourse.threejs.org/t/low-fps-on-ios-mobile-with-pixel-ration-set-as-window-devicepixelratio/4963).
- Community guides cap pixel ratio at about 1.5 on mobile and 2 on desktop (a secondary, partly AI-generated source) — [skills.sh threejs optimizer](https://skills.sh/ovachiever/droid-tings/threejs-graphics-optimizer).
- Antialiasing comparison thread — [three.js forum: Performance of different AA techniques](https://discourse.threejs.org/t/performance-of-different-antialiasing-techniques/56740).
- **Adreno:** reduce overdraw and simplify shaders, especially on mid-tier or older Adreno, to lower power and improve frame pacing — [Qualcomm blog 2025](https://www.qualcomm.com/developer/blog/2025/08/optimize-performance-and-graphics-for-adreno-gpu-low-power-gaming). The newer guide covers tile-based rendering and z-buffer setup — [Qualcomm: Adreno GPU on Mobile: Best Practices](https://docs.qualcomm.com/bundle/publicresource/80-78185-2/topics/mobile_best_practices.md). An older Adreno 3xx claim says early-Z rejects at up to 4× fill rate, but a forum user saw no gain — [Qualcomm forum](https://developer.qualcomm.com/comment/9118).

### Inferences
- **Per-tier plan.**
  - [L]: pixel ratio 1, `antialias: false`, no composer, built-in tone mapping. Vignette can be a CSS radial-gradient overlay on the canvas, which costs no GPU pass (it is composited by the browser).
  - [M]: pixel ratio 1.5, context MSAA (fixed at start, as `quality.ts` notes), no composer. "Glow" is in-material: the sun disc and halo are in the sky shader, glints are just bright pixels.
  - [H]:
    - Composer with a `HalfFloatType` target and `RenderPass`.
    - `UnrealBloomPass` at **half or quarter resolution** (pass a smaller `resolution`, high threshold about 1.0 in HDR so only sun and glints bloom, strength 0.3–0.5).
    - `OutputPass` (tone map + sRGB).
    - Optional `LUTPass` (a 32³ LUT is tiny) for the grade, and FXAA (one pass) instead of MSAA, since MSAA does not apply to composer targets unless `samples` is set on the render target.
    - SMAA costs 3 passes, so it is not worth it on a phone.
- **Excluded:** SSAO/SAO/GTAO (use baked AO instead), SSR (no reflective surfaces), DOF and TAA (history buffers, ghosting on a fast rider).
- **Overdraw** (Adreno/Mali): draw opaque front-to-back (three sorts opaque by depth by default), draw the sky last or with depth test so it only fills uncovered pixels, and keep particle sprites small (§7).

### Gaps
- No device-specific ms costs for UnrealBloomPass at half resolution. The Arm post-processing article could not be read in full.

---

## 6. Trees and rocks (instancing, snow caps, wind, LOD/impostors)

### Takeaway
Use one `InstancedMesh` per prop type and LOD. Make snow-capped pines with cones and vertex colours (snow on upward-facing faces, baked in geometry), in a few hundred triangles at most. Skip wind sway on snowy pines, or apply a tiny vertex sway on [H] only. Distant forests should be a 2–3 triangle billboard or part of the silhouette ring rather than octahedral impostors.

### Cited Findings
- Core `InstancedMesh` does no per-instance culling or LOD selection. The usual pattern is one InstancedMesh group per LOD level with custom culling — [three.js forum: LOD + Instancing](https://discourse.threejs.org/t/lod-instancing/20524).
- One forest project used InstancedMesh2 + BVH culling, a meshoptimizer mid-LOD at 15–100 units and octahedral impostors beyond 100 — [three.js forum: A forest of octahedral impostors](https://discourse.threejs.org/t/a-forest-of-octahedral-impostors/85735). InstancedMesh2 (an external library) adds culling and LOD — [three.ez InstancedMesh2](https://discourse.threejs.org/t/three-ez-instancedmesh2-enhanced-instancedmesh-with-frustum-culling-fast-raycasting-bvh-sorting-visibility-management-lod-skinning-and-more/69344).
- A procedural instanced forest hides distant leaves in the vertex shader so they are discarded before the fragment stage. The author says this mostly helps mobile and low-end GPUs — [three.js forum: Procedural Instanced Forest](https://discourse.threejs.org/t/procedural-instanced-forest-high-performance-real-trees/88610).
- Sine-based sway injected into `MeshLambertMaterial` via `onBeforeCompile` — [Hugging Face orcs-in-the-forest world.js](https://huggingface.co/spaces/victor/orcs-in-the-forest/blob/main/src/world.js).
- A four-level rock LOD ending in impostors — [three.js forum: 100K Procedural Rocks](https://discourse.threejs.org/t/100k-procedural-rocks-brutally-optimized/89578).
- No benchmark numbers were found. The performance claims in these threads are anecdotal.

### Inferences
- **Pine.**
  - Build 3 stacked cones (6–8 sides) plus a trunk cylinder, about 60–120 triangles, merged into one `BufferGeometry`.
  - Use per-vertex colour: snow white where `normal.y > 0.5` on the upper side of each tier, pine green elsewhere. That gives snow caps with no texture, and it keeps the low-poly identity: props can stay `flatShading: true` even if the terrain goes smooth.
  - Use per-instance colour (`setColorAt`) for ±5% hue variation.
  - Place instances on h(x,z) via the same data, so collider and mesh share one source (rule 7).
- **Rocks:** a noise-displaced icosahedron (detail 1, 80 triangles), with snow on top via `normal.y` vertex colour, instanced.
- **LOD.**
  - Big-air levels are compact, so **one LOD + frustum culling by chunks** is enough. Split instances into about 4–8 spatial `InstancedMesh` chunks so three's per-object frustum culling works. Each chunk's `boundingSphere` must be computed (`computeBoundingSphere()` on the InstancedMesh in recent three).
  - Beyond about 150 m, trees become part of the mountain silhouette or a single crossed-quad billboard instanced mesh.
  - Octahedral impostors need an atlas bake and extra shader work, which is overkill here.
- **Wind.**
  - Snowy conifers barely move. If used, apply [H] only: vertex offset `sin(time*1.3 + instancePhase) * 0.03 * heightFactor` via `onBeforeCompile` (`instanceMatrix[3].xz` as phase).
  - About 5 ALU ops per vertex is negligible, but it breaks the "static" mental model and needs a time uniform. Off on [L/M].
- **Tier counts (guess, verify on device):** [L] about 150 trees, [M] about 400, [H] about 1000 instances. The triangle cost is trivial; fill and overdraw from many overlapping cones near the camera matters more.

### Gaps
- No authoritative per-device triangle or instance budget was found. The counts above are unverified estimates.

---

## 7. Particles (snow spray, powder, falling snow)

### Takeaway
Use GPU-animated `THREE.Points` (or instanced quads) with a procedural round soft-edge sprite (no texture), additive or normal blending, `depthWrite: false`. Simulate spray on the CPU in a deterministic ring buffer, or analytically in the vertex shader from spawn time plus velocity. Falling snow should be a camera-attached box of points wrapped with `mod()` in the vertex shader (one draw call). True depth-based soft particles need a depth texture pass: [H] only, or fake it.

### Cited Findings
- Soft particles fade sprites near the geometry behind them using scene depth. The hardware z-test is all-or-nothing, so it cannot fade — [NVIDIA SoftParticles whitepaper (2007)](https://developer.download.nvidia.com/whitepapers/2007/SDK10/SoftParticles_hi.pdf).
- In three.js the usual approach renders the opaque scene to a `WebGLRenderTarget` with a `DepthTexture` and samples it in the particle shader (as in `webgl_depth_texture` and SAOPass) — [three.js forum: Soft Particles rendering performance](https://discourse.threejs.org/t/soft-particles-rendering-performance/27610). Linearising depth needs camera near and far uniforms — [three.js forum: Points transparent depth artifacts](https://discourse.threejs.org/t/points-transparent-textures-depth-artifacts-soft-particles/5927/8).
- Setting `depthTest`/`depthWrite` false on `Points` removes transparency artifacts but also all depth interaction — [same thread /21](https://discourse.threejs.org/t/points-transparent-textures-depth-artifacts-soft-particles/5927/21).
- A WebGL / OpenGL ES soft-particles implementation article — [keaukraine on Medium](https://keaukraine.medium.com/implementing-soft-particles-in-webgl-and-opengl-es-b968d61133b0).
- A three.js particle engine with soft-particle dust fading into the ground — [three.js forum: Particle engine](https://discourse.threejs.org/t/particle-engine/8044).
- Falling-snow shader tutorial for three.js — [Soledad Penades: Rendering snow with shaders](https://soledadpenades.com/articles/three-js-tutorials/rendering-snow-with-shaders/). A real-time three.js snowfall system — [80.lv](https://80.lv/articles/artist-shares-real-time-snowfall-system-built-with-three-js-webgl). A WebGPU/TSL playable snow scene — [three.js forum](https://discourse.threejs.org/t/a-playable-snow-scene-built-in-threejs-webgpu-tsl/94896).
- Slime Rancher 2 snow particle effects breakdown — [Game Developer](https://gamedeveloper.com/design/slime-rancher-2-snow-particle-effects).

### Inferences
- **Spray** (the project already has `src/render/spray.ts`; the existing code was not reviewed).
  - Emit from the board's downhill edge in proportion to the lateral slip speed. The physics already computes the anisotropic friction force, so the spray can be driven by the friction power `|F_lat · v_lat|`, which is physically motivated and free.
  - Keep a ring buffer of about 256 [L] / 512 [M] / 1024 [H] particles.
  - Points shader: `gl_PointSize` scaled by distance and clamped (e.g. ≤ 48 px at pixel ratio 1 to limit fill). Fragment alpha = `1 - smoothstep(0.2, 0.5, length(gl_PointCoord - 0.5))`.
  - Colour: lit by the same hemisphere colours (bright sun side, blue shadow side) via a precomputed per-particle tint from N·L of the spray direction.
- **"Soft" without a depth pass [L/M]:** fade alpha by the particle's height above h(x,z), computed analytically in the vertex shader or on the CPU. Since the ground is an analytic height field, this is an exact substitute for depth-buffer soft particles against the snow, and it costs zero extra passes. This is a direct advantage of the analytic terrain.
- **Depth-texture soft particles [H]:** only if a composer render target with `depthTexture` already exists for bloom.
- **Powder landing burst:** a one-shot burst of 50–150 bigger, slower-expanding sprites, with alpha fading over 0.6–1 s.
- **Falling snow [M/H]** (optional, weather-dependent):
  - 1500 [M] / 4000 [H] points in a 40 m box around the camera.
  - Position = `mod(seedPos + vec3(drift, -fallSpeed, 0) * time - cameraPos, box) + cameraPos - box/2` in the vertex shader.
  - One draw call, static buffers, tiny sprites (2–4 px), so overdraw is low.
  - Off on [L].
- **Determinism:** spray is visual only. Keep it out of the physics step (render-time only), or seed its RNG so tests are not affected.

### Gaps
- No source gave mobile fill-rate budgets for transparent sprites. The particle counts above are estimates to validate with the adaptive `QualityManager` (frame-time based).

---

### Cross-cutting notes for the report writer
- **The analytic h(x,z) is a key asset:** exact smooth normals, CPU-baked AO and horizon, exact "soft" particles against the ground, exact blob-shadow placement and orientation, and slope tint. All are deterministic and unit-testable without a browser.
- **Bug to flag in current code:** `renderer.ts` sets `THREE.PCFSoftShadowMap`, which r187 has removed. It logs a warning and falls back to `PCFShadowMap`.
- **Style conflict to flag:** rule 2 of CLAUDE.md asks for flat shading and `flat(color)` materials. Smooth analytic normals on the snow, plus the shader extras above, would change the look and need the user's approval. Props can stay flat-shaded.
- **WebGPU:** `SkyMesh` and the TSL node materials exist for WebGPURenderer. None of the techniques above need WebGPU, and staying on WebGLRenderer avoids compatibility risk on mid-range Android browsers (no source checked for current WebGPU mobile coverage; this is a gap).
