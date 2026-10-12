---
id: tactile.metal.page
elective: tactile
kind: page
concepts: [tactile.metal]
---

# Metal: all light, no maps

> **In short:** Polished metal has no look of its own beyond a tint: it's a colored mirror, so the same PBR values look different under every HDRI, tone mapping, and extra light, and getting metal right means choosing what it reflects.
>
> **Used for:** Jewelry and watch viewers, chrome and brushed-steel product parts, car paint's clear coat, faucets and hardware, and any shiny part whose material has no textures.

## Why it works

### Same values, different rooms

Each ring below keeps the same material the whole time: metalness 1, roughness 0.03, and a measured color. Only the light changes.

| Ring | Color (linear) | Source |
| --- | --- | --- |
| Yellow gold | 1.00, 0.77, 0.31 | physicallybased.info, measured |
| Silver | 0.99, 0.99, 0.97 | physicallybased.info, measured |
| Platinum | 0.77, 0.73, 0.68 | physicallybased.info, measured |
| Rose gold | `#f2af83` (sRGB) | iJewel's preset: rose gold is an alloy with no single measured value |

A mirror shows what's around it. So the HDRI isn't lighting the ring so much as being the ring: wherever you see bright, the ring is reflecting a bright part of the room, and wherever you see dark, a dark part. Metal reads as metal when the room has both: big bright panels for the long highlights, and dark areas for the dark lines between them. Turn the HDRI and watch the bands slide.

<div data-scene="hdris"></div>

Measured on the gold ring (contrast is how much light and dark it shows, 0 for a flat gray):

| HDRI | Contrast | What happens to metal |
| --- | --- | --- |
| Jewelry studio (iJewel) | 0.42 | Bright and clean: long bright bands and crisp dark lines |
| Softbox studio | 0.68 | Dramatic: mostly dark, with sharp streaks |
| Hard light | 0.46 | A few small hot spots on mid-gray |
| Overcast sky | **0.13** | Flat: nothing dark to reflect, so it reads as dull plastic |
| Warm lamps | 0.56 | The gold's hue shifts from 44° to 32°, toward orange; silver turns orange too |
| Cool studio | 0.67 | The gold shifts to 57°, toward green; silver turns blue-gray |

Picking the jewelry studio is why iJewel's metal looks the way it does. The jewelry elective's "Two lighting files" unit takes that room apart.

### Tone mapping: where the bright reflections go

A polished ring reflects lights at their full brightness: the bare lamp here is 30,000 times brighter than white paper. Without tone mapping, every reflection brighter than white clips flat: under that lamp, 8.8% of the gold ring turns to plain white blobs. With Neutral it's 0.8%, and the gold keeps its color (saturation 0.30). ACES rolls the highlights off smoothly too, but drains the gold to 0.22, and AgX to 0.17.

<div data-scene="tone"></div>

### Extra lights: what each one adds to metal

- A **DirectionalLight** or **PointLight** has no size, and a mirror shows a light at its true size: one tiny hot dot per ring, plus a shadow. On the bench it made under 1% of the ring surface much brighter.
- A **RectAreaLight** has a size, so the ring reflects it as a bright band, the way a photographer's strip softbox looks in a ring. The 60 × 20 cm strip here made 7% of the ring surface much brighter, nine times the key light's area. It needs `RectAreaLightUniformsLib.init()` first, and casts no shadow.
- An **AmbientLight** or **HemisphereLight** lights the diffuse part of a material, and pure metal has none. On the bench it changed 0 of 66,450 ring pixels.

<div data-scene="lights"></div>

So most of metal's look comes from the HDRI. Extra lights add a highlight where you want one, and nothing else.

## The code

### A metal from a measured color

```js
const gold = new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.03 });
gold.color.setRGB(1, 0.773, 0.307);   // linear numbers: setRGB
const rose = new THREE.MeshPhysicalMaterial({ metalness: 1, roughness: 0.03, color: 0xf2af83 }); // sRGB hex
```

### Light it with a room, not lamps

```js
scene.environment = pmrem.fromEquirectangular(studioHdr).texture; // bright panels and dark ones
renderer.toneMapping = THREE.NeutralToneMapping;                   // keeps the gold's color in the highlights
scene.environmentRotation.y = scene.backgroundRotation.y = angle;  // move the bands, keep the background matching
```

### A softbox highlight

```js
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
RectAreaLightUniformsLib.init();                                   // once, before the first RectAreaLight
const softbox = new THREE.RectAreaLight(0xffffff, 8, 0.6, 0.2);    // a 60 × 20 cm strip
softbox.position.set(0, 0.25, 0.12);                                // above and in front
softbox.lookAt(ring.position);
```

## What's off?

Each scene starts wrong, with the same PBR values as above. Fix it with the controls.

<div data-scene="offPlastic"></div>

<div data-scene="offWarm"></div>

<div data-scene="offBlack"></div>

## How it goes wrong

- **Metal looks like gray plastic.** The HDRI is even, like an overcast sky, so there's nothing dark to reflect. Use a studio with bright panels and dark areas.
- **"A light will make it shine."** An AmbientLight or HemisphereLight does nothing to pure metal, and a DirectionalLight or PointLight adds one tiny dot. Change the HDRI, or add a RectAreaLight for a broad highlight.
- **Silver looks gold, or gold looks green.** The HDRI is tinted, and a mirror shows the tint. Light jewelry with a neutral studio.
- **Highlights are flat white blobs.** Tone mapping is off. Use `NeutralToneMapping`.
- **Gold looks pale in the highlights.** ACES and AgX drain strong colors. Use Neutral.
- **Black metal with one bright dot.** No `scene.environment`. A mirror needs something to reflect.
- **Reflections don't match the background.** Only `environmentRotation` was turned; turn `backgroundRotation` with it.
- **"Different metals need different lighting setups."** The four rings share one room. Their colors differ; the room doesn't need to.

<div data-mark-done></div>
