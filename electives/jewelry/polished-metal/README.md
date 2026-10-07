---
id: jewelry.polished-metal.page
elective: jewelry
kind: page
concepts: [jewelry.polished-metal]
---

# Polished metal and tone mapping

> **In short:** Polished metal is a tinted mirror of its room, and tone mapping decides how that room's very bright and very dark parts land on screen.
>
> **Used for:** Gold and silver product shots, chrome car trim, faucet and hardware configurators, and matching a metal to a photo.

## Evidence

iJewel's five polished metal presets are three numbers each. Their files hold no textures at all:

| Preset | Color | Metalness | Roughness |
| --- | --- | --- | --- |
| Rose gold | `#f2af83` | 1 | 0 |
| Yellow gold | `#fec07a` | 1 | 0 |
| White gold | `#c2c2c3` | 1 | 0 |
| Platinum | `#b6b6b6` | 0.88 | 0 |
| Silver | `#fcfcfc` | 0.88 | 0.065 |

- **The colors are sRGB hex,** the numbers a color picker shows.
- **Spring's own metal isn't a preset.** Its material names rose gold as where it started, but Spring.glb stores its own color as glTF's base color, which is linear: (0.784, 0.451, 0.184). That's `#e5b377` in sRGB, a yellower gold, and it's what GLTFLoader hands you.
- **The render settings** sit in the file's `Tonemap` plugin: tone mapping 4 (three.js's number for ACES Filmic), exposure 1, contrast 1.1, saturation 1. The white background skips tone mapping.
- **The room is gray and very bright.** The metal environment has no color on average. Its typical spot is 1.28 times as bright as white paper, its hottest lights reach 84, and about 6% of it is pure black panel. Every bit of color in the metal comes from the material.

Pick a preset, then type its color wrong both ways. Last, show the room behind the band.

<div data-scene="presets"></div>

## Why it works

### A tinted mirror

Light doesn't go into polished metal. It bounces straight off, and the metal's color only decides how much red, green, and blue bounce. So each spot on a ring shows whatever it reflects, times the color: a bright panel makes a bright band, and a black panel a dark one. At metalness 1, that's the whole material. Show the room it reflects above, and orbit to match each dark band to a black panel.

**Analogy: a copper kettle.** What you see on it is the kitchen, warmed by the copper. Carry it into a dark room and it turns dark brown, though the copper never changed.

### Tone mapping decides the lights and darks

The room goes up to 84 times white paper, and a screen tops out at white. **Tone mapping** is the curve that squeezes one into the other, and **exposure** scales all the light before it. three.js starts with none: every value over 1 is cut off at 1, one color channel at a time. On rose gold, red is cut off first, then green, so bright bands drift from rose to yellow to flat white, and they all look the same.

ACES Filmic, the playground's curve, rolls highlights off gradually, so bright bands keep their shape, and it pushes dim values down, so dark bands stay deep. That contrast is most of the polished look, and the likeliest reason lights and darks look wrong. Every curve shifts color a little too: under ACES, rose gold reflecting the typical gray comes out near `#eaccac`, paler than its own hex, and under Neutral near `#f3b083`, almost the hex. The tone mapping page compares the curves in general.

The playground also sets contrast 1.1. three.js's renderer has no contrast or saturation setting, so matching it takes a post-processing pass, and the file doesn't say how iJewel computes it.

Switch the curves and drag **exposure**. Watch the dark bands and the three gray cards, lit at 0.05, 1.28, and 84.

<div data-scene="tone"></div>

### Roughness blurs, metalness mixes in paint

Roughness 0 is a sharp mirror. Higher roughness reads a blurrier copy of the room, made ahead of time by PMREMGenerator, so panel edges soften into satin, then into a dull glow. The shader never goes below 0.0525, so silver's 0.065 is barely softer than 0.

Metalness below 1 mixes in a non-metal. At platinum's 0.88, 88% is the tinted mirror. The rest is the faint, uncolored shine every non-metal has, plus the color as matte paint lit by the blurred room, which lifts the darkest bands from black to dark gray. Lower still, it reads as plastic.

Drag **roughness**, then **metalness**.

<div data-scene="finish"></div>

<details><summary>The math, if you're curious</summary>

How much a surface reflects when you look straight at it is called **F0**. three.js blends it by metalness: `F0 = mix(vec3(0.04), color, metalness)`. At metalness 1 it's the color itself (rose gold's red is 0.888 in linear), and at 0 it's 4% gray for every non-metal. Platinum at 0.88 gets 0.88 × 0.468 + 0.12 × 0.04 = 0.417.

</details>

## The code

What a developer types to build the playground's metal. `metalMaterial('rose gold')` in `electives/jewelry/polished-metal/metal.ts` builds any preset, and the scenes above run it.

### Build a preset

```js
const gold = new THREE.MeshStandardMaterial({ color: 0xf2af83, metalness: 1, roughness: 0 }); // rose gold
scene.environment = pmrem.fromEquirectangular(metalRoom).texture; // what it reflects; without it, black
```

### Tone map like the playground

```js
renderer.toneMapping = THREE.ACESFilmicToneMapping; // the default is NoToneMapping
renderer.toneMappingExposure = 1;                   // the playground's; higher brightens everything
renderer.outputColorSpace = THREE.SRGBColorSpace;   // the default: leave it
```

Changing `toneMapping` later needs no `needsUpdate`: the renderer rebuilds each material's shader on the next frame.

### Type a color in the right space

```js
material.color.set(0xf2af83);               // hex or CSS: sRGB, converted to linear for you
material.color.setRGB(0.784, 0.451, 0.184); // plain numbers: linear, like glTF's base color
material.color.setRGB(0.949, 0.686, 0.514, THREE.SRGBColorSpace); // a picker's 0–1 numbers: say so
```

### Brushed instead of polished

```js
const brushed = new THREE.MeshPhysicalMaterial({ color: 0xf2af83, metalness: 1, roughness: 0.3, anisotropy: 0.8 });
// the streaks follow the model's UVs; anisotropyRotation turns them
```

## How it goes wrong

- **"Leaving tone mapping off keeps colors true."** Without it, everything over white is cut off: highlights blow out into one flat band, gold turns pale yellow, and the darks look harsh. Set ACES Filmic, as above.
- **Metal looks black.** There's no environment, so a mirror has nothing to reflect. Set `scene.environment`. Turning up exposure won't help, since black times anything is black.
- **Metal looks flat or gray.** The wrong environment: a room with no dark panels gives no dark bands. The two lighting files page shows why metal gets its own fake studio.
- **"Point lights make metal shine."** A mirror shows a point light as one tiny hot dot and stays black everywhere else. Light metal with an environment: Spring has no lights at all.
- **Dull, like painted plastic.** Roughness too high, or metalness too low. Polished is roughness 0 to about 0.07, and metalness 1 or close to it.
- **Gold too pale or too dark.** The color is in the wrong space: sRGB numbers typed as linear wash it out, and linear numbers typed as sRGB darken it. Hex goes to `set`, glTF's numbers to `setRGB`.
- **"Metal looks real because of its textures."** None of the five presets has one. A texture can't make up for a poor room, no tone mapping, or a coarse shape, and a polished ring doesn't need one.

<div data-mark-done></div>
