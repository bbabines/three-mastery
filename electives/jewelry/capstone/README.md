---
id: jewelry.capstone.page
elective: jewelry
kind: page
concepts: [jewelry.capstone]
---

# The whole piece in your own code

> **In short:** The playground's look isn't one trick but seven small, separate choices stacked together, and each one can be checked, switched off, and copied on its own.
>
> **Used for:** Diagnosing a product viewer that looks off, building a metal and stone configurator, briefing a 3D artist, and deciding which improvement is worth its cost.

## Evidence

Every piece below is the code from an earlier unit, assembled in one file, `electives/jewelry/capstone/assemble.ts`, and shown at the playground's own camera views and lens.

| Piece | What the playground does | Unit |
| --- | --- | --- |
| The model | Small, flat-faceted, closed stones; triangles spent on the metal; parts tagged | What's in a pro jewelry file |
| The lighting | A studio file for everything, and a room full of tiny lights for the stones | Two lighting files |
| The metal | A color, metalness 1, roughness 0; ACES Filmic tone mapping at exposure 1 | Polished metal and tone mapping |
| Ceramic and pearl | A color and roughness 0; the pearl adds a thin-film shimmer | Ceramic and pearl from lighting alone |
| The wood | Two 1024² tiles projected from three sides | Small tiling textures and triplanar mapping |
| The stones | Light traced inside each stone, with iJewel's settings per kind | The gem shader |
| The finish | A 15° lens, a white background, a soft ground shadow, light bloom, averaged frames | Shadows, glow, and smooth edges |

Switch views and metals. The metal buttons are iJewel's five presets, the way a configurator would offer them.

<div data-scene="whole"></div>

## Why it works

### Switch off one piece at a time

When a viewer looks off, the fastest way to find out why is to take the pieces apart, not to tweak everything at once. Each row below swaps one piece for the shortcut people usually take, and leaves the rest alone:

- **Gems as glass** (`transmission`): the stones go see-through and flat; you see the room behind them, not sparkle.
- **Gems as mirrors**: crisp, but metallic and gray, with no color and no depth.
- **One lighting file**: the metal barely changes, but the stones go pale and milky. The studio is bright almost everywhere, so the facets have no dark areas for contrast, and the center diamond blows out to a white blob.
- **No tone mapping**: colors turn stronger and harsher (the pink ceramic goes salmon, the gold more saturated), and the brightest highlights cut off at white instead of rolling off softly. ACES calms and slightly pales everything, which is much of the playground's soft, expensive look.
- **Wood on its UVs**: the grain stretches into streaks along the band.

**Analogy: a mixing desk.** A band's sound is a dozen instruments on separate faders. When something sounds wrong, the engineer mutes one channel at a time until the problem goes away. Each switch here is a fader.

<div data-scene="layers"></div>

### Your own model, through the same recipe

Pick one of your Shopify `.glb` files. It's scaled to Spring's size and gets the same stage. Spring's parts are found by iJewel's tags; yours are found by guesses. A part is a stone if its material or mesh name contains diamond, gem, stone, ruby, sapphire, emerald, crystal, or CZ, and it's metal if it's fully metallic. Everything else keeps the material it was loaded with. If no stones are found, rename the gem materials in Blender and export again.

<div data-scene="yours"></div>

## The code

The assembly, cut down to what a developer types. Each function comes from the unit that teaches it.

### Load the piece and the two lighting files

```js
const gltf = await gltfLoader.loadAsync('ring.glb');
const [studio, room] = await Promise.all([exr.loadAsync('studio.exr'), exr.loadAsync('gem-room.exr')]);
scene.environment = prefilter(renderer, studio);        // everything reflects the studio...
renderer.toneMapping = THREE.ACESFilmicToneMapping;     // ...squeezed onto the screen like the playground
```

### Give each part its material

```js
gltf.scene.traverse((part) => {
  if (!part.isMesh) return;
  const role = roleOf(part);                            // gem, metal, ceramic, pearl, wood, or other
  if (role === 'gem') part.material = gemMaterial(part.geometry, room, GEMS[kindOf(part)]); // traces the raw room file
  else if (role === 'metal') part.material = metal;     // metalMaterial('rose gold')
  else if (role === 'wood') part.material = wood;       // triplanarMaterial({ map, roughnessMap, ... })
});
```

Reuse one gem material per stone shape, and one metal material for every metal part: switching the metal color in a configurator is then one line, `metal.color.set(0xfec07a)`.

### Stage it like a product photo

```js
camera.fov = 15;                                       // a long lens: little distortion
camera.updateProjectionMatrix();
scene.background = new THREE.Color(0xffffff);          // a plain color is never tone mapped
controls.maxPolarAngle = Math.PI / 2;                  // never look from under the ground
```

### Bringing it to your Shopify app

The files to copy are the units' modules: `gem-material.ts`, `metal.ts`, `ceramic-pearl/materials.ts`, `triplanar.ts`, `two-environments/environments.ts`, `finishing.ts`, and `assemble.ts`, plus the `three-mesh-bvh` package. iJewel's environment files and textures can't ship. Use your own: a studio `.exr` with soft panels and black flags for the metal, a room with many small bright lights for the stones, and seamless 1K tiles. Free (CC0) libraries such as Poly Haven have both kinds.

## How it goes wrong

Start from the symptom and switch off the piece it points to.

| What you see | The piece to check | Unit |
| --- | --- | --- |
| Stones look like glass, plastic, or frosted blobs | The gem shader; flat normals; closed meshes | The gem shader; What's in a pro jewelry file |
| Stones look pale and milky, gray, or dull | The stones' own environment, in HDR | Two lighting files |
| Metal looks like plastic, or black | Metalness 1, roughness 0, an environment | Polished metal and tone mapping |
| Colors look harsh and oversaturated, highlights cut off at white | Tone mapping and exposure | Polished metal and tone mapping |
| Ceramic looks like plastic | Roughness 0 and a good environment, not textures | Ceramic and pearl from lighting alone |
| Wood is stretched, smeared, or pale | Triplanar projection; color spaces | Small tiling textures and triplanar mapping |
| The ring floats or looks like a cheap render | Ground shadow, lens, background | Shadows, glow, and smooth edges |
| Sparkles crawl when the camera stops | Averaged frames | Shadows, glow, and smooth edges |

- **Every stone turns into a white diamond after a configurator change.** The code worked out each stone's kind (ruby, emerald) from its current material, which after the first change is the gem shader, with no tag left on it. Read the kind once, from the material the file loaded, and keep it with the part.
- **"One setting will make it look real."** Each piece fixes one thing, and switching off any one of them is visible. That's why AI fixes that change many settings at once are hard to learn from.
- **"If it looks off, the model is bad."** Spring's own metal and ceramic are plain colors. Most of the look is lighting, the gem shader, and finishing, all of which live in code.

<div data-mark-done></div>
