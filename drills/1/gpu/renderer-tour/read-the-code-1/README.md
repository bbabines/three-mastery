---
id: 1.gpu.renderer-tour.read-the-code.1
loop: 1
tier: light
concepts: [gpu.renderer-tour]
mode: read-the-code
context: gpu.renderer-tour/first-setup
lenses: []
misconceptions:
  - gpu.renderer-tour/antialias-later
  - gpu.renderer-tour/shadowmap-enough
---

# Tour: renderer settings

> **In short:** A few renderer settings, chosen at startup, decide how smooth edges are, how many pixels get drawn, how colors look, and whether shadows show.
>
> **Used for:** A product viewer's first lines, configurators that stay smooth on phones, bright studio shots, and shadows under products.

## A · The basics

### The settings every scene makes

Every scene draws through a **renderer**, and `WebGLRenderer` is the usual one: it owns the `<canvas>` and talks to the GPU. Most of its settings are made once, in an app's first few lines. Two of them, `antialias` and `powerPreference`, go in the constructor and can't change afterwards.

**Analogy: buying a camera, then setting it up.** The sensor comes with the camera you bought and can't be swapped on the day. Resolution, color profile, and the flash are menu settings you pick before you shoot.

| Setting | What it does | Pick it when | Cost |
| --- | --- | --- | --- |
| `antialias` (constructor) | Smooths jagged edges | Almost always | GPU memory; fixed once created |
| `powerPreference` (constructor) | Asks for the fast GPU or the battery-saving one | Heavy scenes: `'high-performance'` | None; the browser may ignore it |
| `setPixelRatio` | Device pixels drawn for each CSS pixel | At setup, capped at 2 | GPU work for every pixel, with its square |
| `setSize` | The canvas's size in CSS pixels | At setup and every resize | The same: width × height × ratio² |
| `outputColorSpace` | Converts the final colors for the screen | Leave it at `SRGBColorSpace` | Almost none |
| `toneMapping`, `toneMappingExposure` | Squeezes bright light into what a screen can show | Bright lights or an HDR environment | A little GPU work for every pixel |
| `shadowMap.enabled` | Lets lights cast shadows | Grounding a product | One more render of the casters per light |

The multisampling page goes deeper on `antialias`, the aspect and resize page on `setSize`, and the color spaces, tone mapping, and shadows pages on the rest.

Try each button. Each one starts from the defaults and runs the line shown in the readout.

<div data-scene="settings"></div>

## B · Working knowledge

### Creating the renderer

```js
const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
```

Constructor options are read once. `renderer.antialias = true` later does nothing, with no error; changing your mind means a new renderer, which uploads and compiles everything again.

### Capping the pixel ratio

`setSize` takes CSS pixels, and the canvas draws `width × ratio` by `height × ratio` device pixels. So the cost grows with the ratio's square: a phone at `devicePixelRatio` 3 draws 9 times the pixels of ratio 1. Capping at 2 still looks sharp, for 4 times.

### Color output

```js
renderer.outputColorSpace = SRGBColorSpace; // the default: leave it
renderer.toneMapping = NeutralToneMapping;  // off (NoToneMapping) by default
renderer.toneMappingExposure = 1;           // brighter above 1, darker below
```

Lighting is worked out in linear numbers, and `outputColorSpace` converts them for the screen; `LinearSRGBColorSpace` there looks too dark. Without tone mapping, anything brighter than the screen can show clips to flat white.

### Getting a shadow

```js
renderer.shadowMap.enabled = true;
sun.castShadow = true;      // the light
rack.castShadow = true;     // each mesh that casts
floor.receiveShadow = true; // each mesh a shadow falls on
```

It takes all four. On a loaded model, set `castShadow` on each mesh with `traverse`, since the flag on its top group isn't passed down. Turning shadows on after the first render also needs `material.needsUpdate = true` on the materials that show them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
