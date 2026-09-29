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

> **In short:** A handful of WebGLRenderer settings, chosen once at setup, decide how smooth the edges are, how many pixels each frame draws, how colors reach the screen, and whether anything casts a shadow.
>
> **Used for:** The first lines of a product viewer; keeping a configurator smooth on phones; getting a bright studio shot to look right instead of washed out; and grounding a product with a shadow underneath it.

## A · The basics

### The settings every scene makes

Every three.js scene draws through a **renderer**, and `WebGLRenderer` is the usual one. It owns the `<canvas>` on the page and the WebGL connection to the GPU. Most of its settings are made once, in the first few lines of an app, and never touched again. Two of them can only be made in those lines: they go in the constructor, and the renderer reads them once, when it connects to the GPU.

**Analogy: setting up a camera before a shoot.** Some choices are made when you buy the camera, like the sensor, and can't be changed on the day. Others, like resolution, color profile, exposure, and whether the flash fires, are settings you pick before you start shooting. The constructor options are the camera you bought; the rest are the settings menu.

### The members, at a glance

| Setting | What it does | Reach for it when | Cost |
| --- | --- | --- | --- |
| `antialias` (constructor) | Smooths jagged edges by taking several samples per pixel | Almost always | GPU memory for the extra samples; fixed once the renderer exists |
| `powerPreference` (constructor) | Asks for the fast GPU or the battery-saving one, on laptops that have both | Heavy scenes: `'high-performance'` | None itself; the browser may ignore it |
| `setPixelRatio` | How many device pixels the canvas draws per CSS pixel | Setup, capped at 2 | GPU work for every pixel and GPU memory grow with its square |
| `setSize` | The canvas's size in CSS pixels | Setup and every resize | The same: pixels drawn are width × height × ratio² |
| `outputColorSpace` | Converts the final colors for the screen | Leave it at the default, `SRGBColorSpace` | Almost none |
| `toneMapping`, `toneMappingExposure` | Squeezes bright lighting into what a screen can show, and sets how bright | Bright lights or an HDR environment | A little GPU work for every pixel |
| `shadowMap.enabled` | Lets lights cast shadows | Grounding a product | One more render of the casting meshes per shadow light, every frame |

This page only maps them out. Resizing has the aspect and resize page, and color spaces and tone mapping each have a page in the materials domain. The multisampling page, later in this domain, goes deeper on antialiasing.

Try each setting on the rack. Each button starts from the defaults and runs one change; the readout shows the line that ran, the canvas's size in CSS pixels and device pixels, and the draw calls the frame made. The scenes on these pages all create their renderer with `antialias: true`, and that can't be turned off afterwards, so the **antialias off** button shows the look another way: it draws the frame into an offscreen picture that has no antialiasing and shows that. The render targets page covers offscreen pictures.

<div data-scene="settings"></div>

## B · Working knowledge

### Creating the renderer

```js
const renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);
```

- **Constructor options are read once.** `renderer.antialias = true` later does nothing: the renderer has no such setting to change. Deciding on antialiasing later means creating a new renderer, which uploads and compiles everything again.
- `powerPreference` takes `'default'` (three.js's default), `'high-performance'`, or `'low-power'`. It's a request, and the browser decides.

### Pixel ratio and size

`setSize` takes CSS pixels, the page's own units. The canvas then draws `width × ratio` by `height × ratio` device pixels, so the pixel ratio's square is what the GPU pays for: a phone at `devicePixelRatio` 3 draws 9 times the pixels of ratio 1. Capping at 2 still looks sharp on high-density screens, for 4 times the pixels instead of 9.

- Call `setPixelRatio` once at setup. The order of the two calls doesn't matter: `setPixelRatio` reapplies the current size.
- The resize lines, `renderer.setSize(w, h, false)` with `camera.aspect` and `camera.updateProjectionMatrix()`, are on the aspect and resize page. Lowering the ratio while the user is orbiting is on the resolution and DPR page, in the optimization domain.

### Color output

```js
renderer.outputColorSpace = SRGBColorSpace; // the default: leave it
renderer.toneMapping = NeutralToneMapping;  // off (NoToneMapping) by default
renderer.toneMappingExposure = 1;           // brighter above 1, darker below
```

- Lighting is worked out in linear numbers, and `outputColorSpace` converts them to sRGB, the color space screens expect. Setting it to `LinearSRGBColorSpace` sends the linear numbers straight to the screen, which looks too dark.
- Without tone mapping, anything lit brighter than the screen can show clips to flat white. `NeutralToneMapping` is built to keep product colors close to their source; the tone mapping page compares the options.

### Shadows

```js
renderer.shadowMap.enabled = true;
sun.castShadow = true;     // the light
rack.castShadow = true;    // each mesh that casts
floor.receiveShadow = true; // each mesh a shadow falls on
```

- **All four lines, or no shadow.** `shadowMap.enabled` only lets shadows happen. For a loaded model, set `castShadow` on every mesh inside it with `traverse`: the flag on the model's top group isn't passed down.
- **Turn it on before the first render.** Each material builds its shader program the first time it's drawn, and turning `shadowMap.enabled` on later doesn't always rebuild it: set `material.needsUpdate = true` on the materials that should show the shadow.
- The shadow is a second render of the casting meshes, seen from the light, every frame. The shadows page covers sharpness and fitting the light's view.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
