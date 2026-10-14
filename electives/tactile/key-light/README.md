---
id: tactile.key-light.page
elective: tactile
kind: page
concepts: [tactile.key-light]
---

# The key light

> **In short:** One low light from the side, balanced against the HDRI, leaves the far side of every bump in shade, and that shade makes a surface feel touchable.
>
> **Used for:** Product photos of leather and fabric, furniture configurators, game props under a sun, and close-ups of anything with grain.

## Why it works

### A low, raking key

The **key light** is the main light: here a `DirectionalLight` you can move. Light from the front hits every bump head-on, so every slope faces it about equally and the relief disappears. Light skimming the surface from the side, **raking** at 15 to 30° above it, lights the slopes that face it and leaves the far slopes in shade, like late-afternoon sun on a brick wall.

The scene starts with the key in front. Try the presets, or tick the box and drag on the scene. The readout's relief is how much the bumps change the swatch's light, measured with the normal map and without it: 0.1 means they move a tenth of it around.

<div data-scene="raking"></div>

Measured on the denim:

| Key light | Angle above the swatch | Relief |
| --- | --- | --- |
| From the front | 82° | 0.007 |
| From the side, higher | 31° | 0.039 |
| From above | 17° | 0.033 |
| Raking from the left | 12° | 0.058 |

The swatch leans back, so light from straight above skims it too. Glossy leather adds a second way: from the front, the key's reflection lands on the swatch, and the grain shows inside that highlight (relief 0.09). It shows only where the highlight falls, and moves when the camera does; a raking key shows the grain everywhere.

### Balancing it against the HDRI

The key lights one side; the HDRI lights the rest. Their balance is the **lighting ratio**: how much brighter the gray ball's lit side is than its shade. Too little and the key barely shows; too much and the shade goes black, hiding the material there. Something between about 2 and 8 times keeps detail on both sides. On the bench, a key of 2.5 with the HDRI at 1 measures about 3; turning the HDRI down to 0.25 makes it 11, and to 0.1 with a key of 6, over 100.

<div data-scene="balance"></div>

### Light color

A key's color should agree with the room's. A warm key in a warm room reads as one place; a cool key in a warm room gives a gray lit side and brown shade, as if two scenes were pasted together. That can be a deliberate look, but it's never a neutral one. The scene starts that way.

<div data-scene="color"></div>

### A rim light for dark materials

Dark denim against a dark background loses its outline. Here the samples stand on black velvet, as product photographers stand dark products. A **rim light** sits low behind the object, facing the camera, and grazes only the tops and edges that turn away from you, outlining them against the dark. Because it only grazes, it needs to be strong: here about four times the key.

<div data-scene="rim"></div>

### Normal maps shade, but cast no shadows

A normal map only tilts the shading: each point turns lighter or darker by how it faces the light. The shadow map sees the real geometry, which is flat, so nothing on the swatch falls into a shadow cast by its own bumps. The readout measures the grain with the swatch taking shadows and without: on the leather under a raking key, 0.045 both ways. Real bumps that cast shadows need real geometry, such as a `displacementMap` on a finely divided mesh.

<div data-scene="normalShadow"></div>

## The code

### A raking key

```js
const key = new THREE.DirectionalLight(0xffffff, 2.5);
key.position.set(-1, 0.3, 0.2); // low and from the side: 15–30° above the surface
key.target = swatch;            // aims at the sample
key.castShadow = true;
```

### Balance it against the room

```js
key.intensity = 2.5;            // the lit side
scene.environmentIntensity = 1; // the shade side: the HDRI
```

### Color and rim

```js
key.color.set(0xffb46b);                              // warm, to match a tungsten room
const rim = new THREE.DirectionalLight(0xffffff, 10); // behind the object, facing the camera
rim.position.set(0.35, 0.4, -0.85);                   // low: about 23° up
```

## What's off?

Each scene starts with something wrong. Fix it with the controls: the counter says how many things are still off, not which.

<div data-scene="offFlat"></div>

<div data-scene="offDark"></div>

## How it goes wrong

- **"Light from the front shows a material best."** Front light hits every slope equally, so relief goes flat. Move the key to the side, low.
- **"Shadows make the pores show."** The pores come from the normal map's shading. A shadow map can't see them.
- **"More lights look more real."** Each extra light fills the key's shade and adds a highlight. Use one key and the HDRI.
- **Black shadows and a glaring lit side.** The HDRI is turned down and the key turned up. Balance them to a ratio of about 2 to 8.
- **Cool highlights, warm shadows.** The key's color fights the room's. Match the key to the HDRI.
- **A dark object vanishes into a dark background.** Add a rim light low behind it, facing the camera.

<div data-mark-done></div>
