---
id: jewelry.finishing.page
elective: jewelry
kind: page
concepts: [jewelry.finishing]
---

# Shadows, glow, and smooth edges

> **In short:** Around the materials, the playground adds a long lens, a soft shadow baked once, a faint glow on only the brightest sparkles, and edges averaged smooth.
>
> **Used for:** Product viewers, still product shots, matching a reference render, and grounding any object on a plain background.

## Evidence

Spring's file saves the playground's whole render setup alongside the ring. The parts that frame the materials:

| Setting | In the file |
| --- | --- |
| Camera | Field of view 15°; orbit stops at the target's height (`maxPolarAngle` π/2), no closer than 0.35; the opening view sits 8.5 units out |
| Ground | A baked shadow: one shadow-casting light (a 1024 × 1024 shadow map) moved to a random direction each frame, averaged over up to 400 frames, on a white ground 8 units across |
| Background | White; neither it nor the ground is tone mapped (`tonemapBackground` and `tonemapGround` are both false) |
| Bloom | Threshold 2, intensity 0.2, radius 0.6, 4 iterations |
| Smooth edges | `Progressive`: 32 frames, each shifted by part of a pixel, averaged once the camera stops; `TAA` while it moves |
| Screen-space reflections | On: 16 steps, intensity 1 |
| Ambient occlusion | SSAO, intensity 0.25 |

Switched off: chromatic aberration, vignette, color grading (LUT), film grain, depth of field, screen-space global illumination, and contact shadows. Nothing here changes the ring's materials. It's the photography around them.

This is Spring with all of it rebuilt in three.js, except the reflections and occlusion (see the end of the next part), and with mirror stand-ins for the stones until the gem shader unit. Orbit it: the edges go rough while it moves and settle once it stops. Pick one of your own `.glb` files to see it in the same setup.

<div data-scene="playground"></div>

## Why it works

### A long lens

The **field of view** is how wide the camera sees, as an angle from the bottom of the picture to the top. The playground's 15° is a long lens, the kind product photographers use. To fit the ring in such a narrow view, the camera stands far back, so the nearest and farthest parts of the ring are nearly the same distance away and are drawn nearly the same size. At three.js's default of 50°, the camera has to come close to fill the frame. Then the near side is much closer than the far side, and it swells.

Each button keeps the ring the same size by moving the camera. Watch the near side of the band and the readout's size ratio.

<div data-scene="lens"></div>

<details><summary>The math, if you're curious</summary>

To keep the framing, the distance scales with the lens: `distance = distanceAt15 × tan(7.5°) / tan(fov / 2)`. Changing both together is a **dolly zoom**, the film trick that warps a background while the subject stays put.

</details>

### A shadow baked once

A three.js shadow map draws the scene again from the light, to see what the light hits first. One light gives one crisp outline, which reads as a single flash. Jewelry is usually shot under big soft lights, so a real shadow is darkest where the ring touches the table and fades out from there.

The playground fakes the big light. Every frame it moves one shadow-casting light to a new random direction above the ring, and averages that frame's shadow into a texture on the ground. After 400 directions it stops. Where the band touches the ground, every direction is blocked, so it stays dark; a little farther out only some are, so it fades.

**Analogy: a long exposure.** Each frame is a quick, sharp snapshot. Averaging hundreds of them is the long exposure, where everything that moved blurs smooth. The smooth edges below work the same way.

The ground and the background are the same untouched white, so no horizon line shows. Switch between the three grounds, and compare the triangles drawn: a real-time shadow draws the ring twice every frame.

<div data-scene="groundShadow"></div>

### Bloom only above white paper

**Bloom** is a soft glow spread around very bright pixels, the way a camera lens smears a bright light. The **threshold** decides what glows: only pixels brighter than it. Brightness here is measured before tone mapping, which squeezes bright light into the screen's 0–255, and 1.0 is white paper. The playground's threshold of 2 means only light more than twice as bright as white paper glows: the hot sparkles on polished metal and stones, under a tenth of the ring.

The numbers don't carry over to three.js's `UnrealBloomPass`. Its strength is multiplied by 3 inside, and it always blurs at five sizes, so the playground's 0.2 covers the ring in haze. A strength of 0.03 gives a faint glow. Try each, then put the white background into the scene instead of adding it last.

<div data-scene="bloom"></div>

Bloom costs 13 extra draws a frame, each a pass over the whole picture, all but the last at half size or smaller: GPU work for every pixel, every frame.

### Smooth edges by averaging

A pixel shows one color, so an edge crossing it becomes a stair step, and a thin highlight is either in a pixel or in the next one. **Anti-aliasing** smooths that. Multisampling (MSAA, what `antialias: true` turns on) checks several points in each pixel, four here, for which triangle covers it, so outlines come out smooth. But it usually shades each pixel once, so a highlight inside a surface still jumps from pixel to pixel, and as the ring turns, the sparkle crawls and shimmers.

The playground's progressive pass uses **jitter**: each frame, the camera shifts by a different fraction of a pixel, and the frames are averaged. After 32 frames, each pixel holds the average of 32 slightly different spots, outlines and highlights alike. It only works while the picture is still, so any move starts the average over. While moving, the playground switches to TAA (temporal anti-aliasing), which usually blends in earlier frames, shifted to follow the motion. three.js's `TAARenderPass` doesn't follow motion, so here a moving view falls back to MSAA.

Switch modes and look at the gold edges, then let the camera turn.

<div data-scene="smoothEdges"></div>

Once 32 frames are in, the scene isn't drawn again until the view changes. That takes the draws from about 150 a frame to 15.

### Reflections and contact darkness

The playground also has two effects worked out from the finished picture. **Screen-space reflections** let polished metal reflect things that are on screen: for each shiny pixel, the playground steps along the reflected direction through the picture's depth, 16 steps, to find what's there. That's how a prong can reflect the stone beside it, which the environment can't show. **Ambient occlusion** darkens tight gaps, between prongs and under stones, where less of the surrounding light reaches; the playground's 0.25 is subtle. three.js has `SSRPass` for the first and `SSAOPass`, `SAOPass`, and `GTAOPass` for the second (the last two look better and cost more). Each draws the scene again every frame, for its normals and depth, so they aren't in the module here.

## The code

What a developer types to finish the look. The whole module is in `electives/jewelry/finishing/finishing.ts`, and every scene above runs it.

### Set the lens and the orbit

```js
camera.fov = 15;                       // a long product lens
camera.updateProjectionMatrix();       // fov only takes effect after this
controls.maxPolarAngle = Math.PI / 2;  // stop at the target's height: never under the ground
controls.minDistance = 0.35;
```

### Keep the background white

```js
scene.background = new THREE.Color(0xffffff); // straight to the canvas: a plain clear, never tone mapped
scene.background = null; // through a composer: leave it empty, and add the white after tone mapping
```

### Bake the ground shadow

```js
light.position.copy(center).addScaledVector(direction, size + height); // a new random direction above
renderer.setRenderTarget(sample); renderer.clear(); renderer.render(bake, top); // where the shadow falls now
blend.uniforms.weight.value = 1 / ++framesBaked; // new × 1/n + old × (1 − 1/n): a running average
renderer.setRenderTarget(average); quad.render(renderer); // blended into the ground's texture
```

`bakedGroundShadow(renderer, ring)` does it all. Call its `step()` each frame until `done`. Each step draws the ring once more, into the light's shadow map; once all 400 are in, the ground is one textured square, 2 triangles a frame.

### Chain the passes

```js
const composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 }));
composer.addPass(new RenderPass(scene, camera, null, new THREE.Color(0x000000), 0)); // empty behind the ring
composer.addPass(new UnrealBloomPass(size, 0.03, 0.6, 2)); // strength, radius, threshold
composer.addPass(new ShaderPass(OutputOnWhiteShader)); // tone mapping and sRGB, then onto white
```

The multi-pass page shows how each pass reads the picture the one before it drew.

### Average frames while the view is still

```js
const progressive = new TAARenderPass(scene, camera, 0x000000, 0);
progressive.accumulate = true; // one jittered frame each frame, up to 32, then it stops drawing the scene
controls.addEventListener('change', () => finishing.restart()); // the view moved
if (!averaging) progressive.accumulateIndex = -1; // so the next still frame starts a fresh average
```

`finishingComposer(renderer, scene, camera)` wires all of this and switches to MSAA while the view moves. While it averages, each frame draws the scene about once, as a plain frame would.

## How it goes wrong

- **The ring floats.** No ground shadow, so nothing ties it to the floor. Bake one.
- **"A sharp shadow looks more real than a soft one."** A crisp shadow says one small light, like a camera flash, and looks like a cheap render. Average many light directions instead.
- **"Bloom makes everything look expensive."** A low threshold makes the whole ring glow: soft, dreamy, and washed out. Keep the threshold above white paper and the strength low, and don't copy another renderer's numbers into `UnrealBloomPass`.
- **"antialias: true smooths every edge."** It only smooths outlines, and the sparkle still crawls. It also stops at the canvas: once a composer draws into its own render targets, those need `samples` (EffectComposer's default has none), or the edges go jagged.
- **The ring looks distorted, like a toy.** A wide lens up close. Use a long one, around 15°, and move back.
- **"A white background color always shows as white."** Through a composer, `OutputPass` tone maps every pixel, background included, so white comes out 226 of 255. The same happens to an unlit white ground plane unless its material sets `toneMapped: false`.
- **The camera dips under the ground.** Without `maxPolarAngle`, the orbit goes below the floor and shows the ring from underneath.

<div data-mark-done></div>
