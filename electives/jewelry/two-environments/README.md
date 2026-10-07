---
id: jewelry.two-environments.page
elective: jewelry
kind: page
concepts: [jewelry.two-environments]
---

# Two lighting files

> **In short:** A jewelry viewer gives the metal and the gems different environments to reflect, because a polished mirror and a cut stone need opposite kinds of light.
>
> **Used for:** Lighting a product viewer, choosing HDR files, briefing a 3D artist, and matching a reference viewer.

## Evidence

An environment is a 360° picture of a room, stored as one flat panorama, that every shiny surface reflects (the environment maps page covers how). iJewel's playground loads two for Spring, both `.exr` files of 2048 × 1024 pixels. Measured against white paper as 1.0:

| | Metal file (`env_metal_011`) | Gem file (`env_gem_001`) |
| --- | --- | --- |
| What it shows | A fake studio: a bright gray room, black panels, small hot lights | A real room: chandeliers, ring lights, windows |
| Median brightness | 1.28 | 0.39 |
| Brightest spot | 84 | 284.5 |
| Brighter than white paper | 61% of the picture | 9.7% |
| Separate lights over 8 times white | 3 | 104 |
| Color | None: pure gray | Nearly none |
| File size | 314 KB | 1.1 MB |

`Spring.glb`'s viewer settings say who reflects which:

- **The scene's environment is the metal file**, at intensity 1 and rotation 0, with `fixedEnvMapDirection: true`, a setting the file names but doesn't explain. No other material names an environment, so the metal, wood, ceramic, and pearls reflect this one.
- **The `Diamond` plugin has its own `envMap`: the gem file.** It has slots for two more (`envMap2`, `envMap3`), both empty. The gem file is stored as a plain picture (`mapping: 300`, three.js's `UVMapping`), not set up as an environment, for the gem shader to read.
- **Each gem sets its own intensity:** 1.3 for the white diamonds, 1.03 for the yellow sapphires, 1 for the rubies and emerald leaves.
- **The background is neither file.** It's plain white, and not tone mapped (`tonemapBackground: false`).

Switch files, then drag **exposure** down. Each room fades and leaves only what's far brighter than white paper: three hot lights in the metal file, about a hundred lamps in the gem file.

<div data-scene="panoramas"></div>

## Why it works

### A band shows the whole room; a facet shows one spot

Polished metal is a curved mirror, so each point on a band reflects a different direction, and the curve sweeps across a wide piece of the room. You read its shape from the edges where bright meets dark: a black panel draws a dark band that bends with the metal. The metal file is made for that: a bright room that shows the metal's color, black panels for the shape lines, and no color of its own, so gold stays gold.

A facet is a small flat mirror, so it shows one small spot of the room. It flashes when that spot is a lamp. Sparkle needs many lamps, far brighter than the room: the gem file has 104 separate lights over 8 times white, and its brightest is about 730 times its median. The metal file has 3, and its brightest is about 66 times its median. As the stone turns, facets cross lamps and flash on and off.

So one file can't do both. Light everything with the metal file and the gems mirror a gray studio. Light everything with the gem file and the metal turns into a dim, busy picture of a room.

**Analogy: a car showroom and a jewelry counter.** Car photographers light paint and chrome with huge soft panels and black boards that draw clean lines along the body. A jewelry counter hangs dozens of tiny spotlights so every stone throws sparks.

Switch which file lights what, and watch the gems as the ring turns. The gems are a mirror stand-in until the gem shader unit.

<div data-scene="split"></div>

### The lamps only work in HDR

An HDR file (`.exr` or `.hdr`) stores how bright each spot really is, with no ceiling. A JPG or PNG stops at 1.0, white. Cut the gem file off at 1.0 and its lamps become as bright as a white wall: nothing in the room stands out, so no facet can outshine its neighbors, and it loses more than half its light. The metal file loses its hot lights, and its bright room goes one flat white.

Tone mapping, which squeezes any brightness into what a screen can show, makes this plain. A facet reflecting a 284 lamp stays white three stops darker; one reflecting a 1.0 wall goes gray. With the clipped file, not one pixel of the stone below reaches full white, at any exposure.

<details><summary>The math, if you're curious</summary>

Exposure is counted in **stops**, the term cameras use: each stop doubles or halves the light, so exposure = 2<sup>stops</sup>. Three stops down is 1/8. A lamp of 284.5 is still 35 after that, far above white; a clipped 1.0 is 0.125, a mid gray once tone mapped.

</details>

Switch to the clipped files, then lower the **exposure**, and watch the count of white pixels.

<div data-scene="clipped"></div>

## The code

What a developer types to light a piece this way. The reusable version is in `electives/jewelry/two-environments/environments.ts`.

### Check a lighting file

Pick an `.exr` or `.hdr` from your viewer to compare it with iJewel's. For metal, look for a median above 1, no tint, and a few lights. For gems, look for dozens of lights far brighter than the room. A brightest spot of 1.0 means it was saved as a JPG or PNG somewhere along the way.

```js
const stats = measurePanorama(equirect.image); // from environments.ts
stats.max;             // the brightest spot: 284.5 for the gem file
stats.lightsAbove(8);  // separate lamps over 8 times white: 104 for the gem file
```

<div data-tool="check"></div>

### Load and prefilter a lighting file

```js
const equirect = await new EXRLoader().loadAsync('env_metal_011.exr'); // keeps values above 1.0
equirect.mapping = THREE.EquirectangularReflectionMapping;              // it's a panorama
const pmrem = new THREE.PMREMGenerator(renderer);
const metalEnvironment = pmrem.fromEquirectangular(equirect).texture;   // blurred copies for each roughness
```

`.hdr` files load the same way with `HDRLoader`. three.js prefilters on its own the first time it draws, but doing it here moves that work out of the first frame.

### Give metal and gems their own file

```js
scene.environment = metalEnvironment;  // every part without its own envMap reflects this
gemMaterial.envMap = gemEnvironment;   // the gems' own file, which wins over the scene's
gemMaterial.envMapIntensity = 1.3;     // iJewel's white diamonds
```

A material's `envMapIntensity` only counts while it has its own `envMap`. Parts on the scene's environment use `scene.environmentIntensity` instead.

### Turn a lighting file

```js
scene.environmentRotation.y = Math.PI / 2; // turns the room for every part on scene.environment
gemMaterial.envMapRotation.y = Math.PI / 4; // turns only this material's own envMap
```

Each file turns on its own, so you can move where the sparkle lands without moving the lines on the metal.

### Keep the background plain

```js
scene.background = new THREE.Color('#ffffff'); // a plain color: not tone mapped, and not a lighting file
```

## How it goes wrong

- **"One HDR lights everything."** Gems look pale and milky, like gray glass, or the metal looks like a dim photo of a room. Give the gems' material its own `envMap`, as above. A Blender scene has one World, so its previews light everything with one HDR, and the `.glb` carries no lighting at all: the viewer's code loads both files.
- **"A JPG or PNG environment is good enough."** Stones never flash and the metal looks flat. It tops out at 1.0, so every lamp is as bright as a wall. Use the `.exr` or `.hdr`, and check it: a brightest spot of exactly 1.0 means it was clipped.
- **An outdoor sky HDR.** The metal turns bluish, and a sharp horizon line, where sky meets ground, runs across every curve. Use a studio file: neutral, with soft panels and no horizon.
- **"The lighting file has to be the background too."** The room shows up behind the ring as a blurry smear: with iJewel's 15° lens, the screen shows about 85 of the file's 1,024 rows from top to bottom. The environment lights the piece whether or not it's shown. Set `scene.background` to a plain color, as iJewel does.
- **A small file.** three.js turns a 2048-wide panorama into a cube 512 pixels on a side, but a 1024-wide one into 256, so a polished band's reflections go soft close up. Use 2048 × 1024 or larger.

<div data-mark-done></div>
