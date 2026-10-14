---
id: tactile.reading-light.page
elective: tactile
kind: page
concepts: [tactile.reading-light]
---

# Reading the light

> **In short:** Before lighting a material, look at the room: a gray ball shows where the light comes from and how even it is, and a chrome ball shows the room itself.
>
> **Used for:** Picking an HDRI for a product viewer, matching a 3D object to a photo, lighting a game prop, and diagnosing a scene someone else lit.

## Why it works

### Gray clay first

Every scene on this page is lit by the HDRI alone, its brightest light coming from the front left; The key light unit adds a light of your own. There are no shadows yet: an HDRI casts none, which Shadows and grounding fixes. Start with **gray clay**: the same shapes in plain mid gray, no maps. Clay shows what the light does to the shape, so when the material goes back on, you know whether a flat look comes from the light or the maps.

Next to the samples sit a **gray ball** and a **chrome ball**, the two balls film crews shoot on set. The gray ball shows how bright the light is, which side it comes from, and how soft its edge is. The chrome ball is a mirror: it shows the whole room, lamps and all.

<div data-scene="clay"></div>

### Choosing an HDRI

An HDRI isn't just a background: `scene.environment` lights everything, and `scene.background` only paints what's behind. Switch the background and the material doesn't change at all; switch the HDRI and everything does.

What matters for a material is how **one-sided** the room is. Light from one side leaves the far side of every bump in shade, and the shade is the relief. Light from everywhere, like an overcast sky, fills every bump from all sides. The readout's **relief** is how much the swatch's bumps change its light: the scene is drawn with the normal map and without it, pixel by pixel, so 0.1 means the bumps move a tenth of the light around.

<div data-scene="choose"></div>

Measured on the leather:

| HDRI | Gray ball, bright side ÷ dark side | Swatch relief |
| --- | --- | --- |
| Overcast sky | 1.8 | 0.04 |
| Softbox studio | 2.6 | 0.03 |
| Hard light | 2.0 | 0.11 |
| Warm lamps | 11.3 | 0.08 |
| Cool studio | 3.5 | 0.29 |

The gray ball shows how one-sided the room is for a shape. Fine grain also needs a small, bright source: the softbox lights the shape from one side, but its big soft panel adds almost nothing to the grain, while the bare lamp and the cool studio's daylight bring it out.

### Turning the room

`scene.environmentRotation` turns the lighting and `scene.backgroundRotation` turns what's behind. They're separate, so turning one leaves the other where it was. Turn only the lighting and watch the lamp in the chrome ball move while the room behind stays put.

<div data-scene="rotate"></div>

### The room's color

An HDRI's color tints everything it lights, and each side of an object takes the color of the part of the room that lights it. The gray ball shows both: under the warm lamps its lit side is warm and its shade dark brown; in the cool studio its lit side is cool and its shade gray; the bare lamp is slightly warm all over. If the gray ball isn't gray on screen, no material on the bench shows its own color either.

<div data-scene="tint"></div>

### Brighter isn't more detail

`scene.environmentIntensity` scales the whole room's light. Every point gets brighter by the same factor, so the shade inside each bump rises with the lit side, and tone mapping then squeezes the brights together. On the leather under the softbox, four times the light made the swatch six times brighter on screen, but its relief stayed at 0.03 and the gray ball's ratio fell from 2.6 to 1.7. Detail comes from where the light comes from, not how much of it there is.

<div data-scene="brightness"></div>

## The code

### Light with a room, show another behind

```js
scene.environment = pmrem.fromEquirectangular(studioHdr).texture; // lights every material
scene.background = new THREE.Color(0x2b2e34);                      // only paints what's behind
```

### Turn the room

```js
scene.environmentRotation.y = angle; // the lighting
scene.backgroundRotation.y = angle;  // what's behind: a separate setting
```

### Clay and reading balls

```js
const clay = new THREE.MeshStandardMaterial({ color: 0x767676, roughness: 0.5 }); // mid gray
const chrome = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 });   // a mirror
```

## What's off?

Each scene starts with something wrong. Fix it with the controls: the counter says how many things are still off, not which.

<div data-scene="offTint"></div>

<div data-scene="offFlat"></div>

## How it goes wrong

- **The material looks flat even with good maps.** The HDRI is even, like an overcast sky. Pick a room with one strong side.
- **"Any HDRI will do; it's just a background."** The environment lights every material; the background only paints behind. Choose it for its light.
- **Reflections don't match what's behind.** Only `environmentRotation` was turned. Set `backgroundRotation` to the same angle.
- **Every material looks orange, or blue.** The HDRI is tinted. Check the gray ball, and use a neutral room for products.
- **Turned the environment up and it looks paler, not more detailed.** Brightness scales the shade with the light. Change the room's direction instead.
- **Can't tell whether the light or the maps are wrong.** Swap in gray clay and look again.

<div data-mark-done></div>
