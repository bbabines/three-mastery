---
id: effects.transmission.page
elective: effects
kind: page
concepts: [effects.transmission]
renderer: webgpu
---

# Glass

> **In short:** A material that lets light through like glass: you see what's behind it, bent by its shape, under reflections at full strength.
>
> **Used for:** watch crystals, bottles and drinking glasses, headlight covers, and lenses or gems seen from a distance.

## What it adds

### Seeing through without fading

Real glass doesn't fade what's behind it. Almost all the light passes through, and the surface still reflects the room as brightly as any polished surface. Lowering `opacity` does something else: it mixes the whole surface, reflections included, with what's behind, so the glass turns into a faint gray film. Lower opacity doesn't make glass.

**Transmission** does it the glass way. Each frame the renderer copies the picture drawn so far, and the glass shows that copy, shifted by how the light bends through it, with its reflections added on top.

Think of a camera taking a snapshot of the room, and the glass showing the snapshot, warped by its lens.

The watch's crystal is transmission 1, roughness 0. GLTFLoader also makes it double-sided, and then the renderer draws the crystal's back faces into what the front faces see, so they show the glass's own inside too: a hazier, paler dial. That happens on WebGPURenderer and on WebGLRenderer alike. One side keeps real transmission with a clear dial. Switch between **transmission, one side**, **double-sided, as loaded**, **opacity 0.3**, and **none**.

<div data-scene="adds"></div>

### Bending, depth, and what the copy holds

A glass ball floats in front of the dial. `ior` (index of refraction) sets how much light bends: 1.0 is air and bends nothing, 1.5 is glass, 2.4 diamond. `thickness` is how deep the glass is, in scene units: 0 treats it as a thin shell, so nothing behind it is bent. **Green, by depth** tints with `attenuationColor`: the deeper the light travels in the glass, the greener.

Then put something between the ball and the dial. A **see-through red sheet** isn't in the ball, and neither is a second **glass pane**. Turn the **watch's crystal** off and try again: the sheet appears, the pane still doesn't. The copy is taken once a frame, just before the first glass is drawn. See-through parts are drawn from back to front, so anything see-through behind the first glass is in the copy and anything after it isn't; the crystal is the farthest glass here, so with it on, nothing see-through gets in. Glass doesn't reliably show other see-through parts behind it.

<div data-scene="lens"></div>

WebGLRenderer, the Shopify route, is stricter: its transmission picture is drawn from solid parts only, so no see-through part ever shows through glass there. That's why the bench turns the dial's printed numerals, a see-through square in the file, into a cutout.

## What it costs

### A copy of the picture every frame

Before the first glass draws, the renderer copies the whole picture and makes smaller, blurred copies of it for rough glass to read. Double-sided glass makes a second copy for the back faces and draws the glass twice. The cost grows with the pixels, not with how much glass is on screen, and it's paid every frame.

Try each setting at pixel ratio 1, then 2, pressing **time it** for each.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer.

On an M4 Pro Mac at pixel ratio 2, two runs each, in ms a frame on WebGPU: no crystal 0.5–0.7, opacity only 0.8–1.0, one side 1.1–1.2, double-sided 1.5–2.4. On WebGL 2: 1.5–1.9, 1.7–2.1, 2.5–3.3, and 3.2–3.4. At pixel ratio 1 all four stayed under 1 ms on WebGPU and 1.5 on WebGL 2, too close to rank. Draws barely change, one or two: the copy isn't a draw, it's a full-screen copy.

WebGLRenderer pays more. Instead of copying, it draws every solid part of the scene a second time into its own picture for the glass, each frame, at 4× multisampling. That's the extra scene draw to budget for in the Shopify viewer: for the watch, its 20 solid parts and about 120k triangles drawn again every frame. `renderer.transmissionResolutionScale = 0.5` draws that picture at half size.

## When to use it

The live WebGi page draws the crystal with transmission, and its dial stays clear. The crystal's material is double-sided in the file, and nothing in the reference files says how WebGi avoids the washout; the washout itself is how r186 draws double-sided glass, so this page draws one side. Its printed numerals are a see-through square, which is why it matters what the glass can see.

| Use it | Skip it |
| --- | --- |
| Glass over something people look at: a dial, a label | Glass that's a thin, flat cover seen straight on |
| Thick glass that should bend what's behind it | Many glass parts stacked in front of each other |
| One or two glass parts | Phones, unless it's measured on one |

Cheaper: for thin flat glass, a `MeshPhysicalMaterial` with `transparent: true`, a low `opacity`, and reflections kept (`roughness: 0`), or no glass mesh at all and just its reflection. For gems, the jewelry elective's gem shader traces rays inside the stone instead.

## The code

### Make glass

```ts
const glass = new THREE.MeshPhysicalMaterial({ transmission: 1, roughness: 0, metalness: 0 });
glass.ior = 1.5;       // how much it bends light: glass
glass.thickness = 0.1; // how deep it is, in scene units; 0 for a thin shell
```

### Fix a loaded crystal

```ts
crystal.material.side = THREE.FrontSide; // GLTFLoader makes it DoubleSide: a hazy dial
crystal.material.needsUpdate = true;
```

### Tint by depth

```ts
glass.attenuationColor.set(0x2fa060); // the color light turns as it travels through
glass.attenuationDistance = 0.6;      // how far it travels before it's that color
```

### Keep decals visible under glass

```ts
decal.transparent = false; decal.alphaTest = 0.5; // a cutout is solid, so it's in the copy
decal.depthWrite = true;
```

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| A faded, gray film | `opacity` used for glass | `transmission: 1`, `opacity` 1 |
| A hazy, washed-out dial under the crystal | Double-sided glass shows its own back faces | `side = THREE.FrontSide` |
| A see-through part vanishes behind glass | The copy is taken before it's drawn, or (on WebGLRenderer) never includes see-through parts | Make it a cutout, or solid |
| Glass behind glass looks empty | Glass is never in another glass's copy | One glass layer where you can |
| Nothing behind thick glass looks bent | `thickness` is 0 | Set it to the part's real depth |
| Tint doesn't show | `attenuationDistance` left at Infinity | Set a distance near the glass's depth |
| Rough glass is blurry and blocky | It reads the small copies | Keep roughness low, or accept it |

<div data-mark-done></div>
