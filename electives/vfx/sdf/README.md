---
id: vfx.sdf.page
elective: vfx
kind: page
concepts: [vfx.sdf]
renderer: webgpu
---

# Signed distance fields

> **In short:** A signed distance field gives every point its distance to the edge of a shape, negative inside and positive outside, and a shader turns those distances into a mask with a crisp or soft edge, with no texture at all.
>
> **Used for:** Range circles and selection rings on the floor in games and product viewers; rounded buttons, badges, and glows in 3D interfaces; the glowing edge that eats into a part as it dissolves; and text that stays sharp at any zoom, which is how three.js text libraries like troika-three-text draw letters.

## A · The basics

### Every point knows how far it is from the edge

Picture a circle drawn on a square. Pick any point on the square and ask one question: how far is it from the circle's edge? Points on the edge get 0. Points outside get a positive distance, and points inside get a negative one, so the number also tells you which side you're on. That's what **signed** means: the distance carries a plus or minus sign.

Ask the question for every point on the square and you have a **distance field**: one number for every point. In a shader the question is asked once for every pixel, so the field is never stored anywhere. Each pixel works out its own number.

**Analogy: a lake's shoreline.** Stand anywhere near a lake and you can say how far you are from the shore. On land, count it as positive. Out in the water, count it as negative: the distance you'd have to swim back. The shoreline itself is every spot where the answer is 0.

Move the pointer over the square. The white line runs from the dot to the nearest point on the edge, and its length is the distance. Blue is inside (negative), orange is outside (positive), and the white outline is where the distance is 0. Switch to the box: the shape changes, but the question stays the same.

<div data-scene="field"></div>

<details>
<summary>The math, if you're curious</summary>

For a circle, the distance is how far the point is from the center, minus the radius: d = |p − c| − r. A point 0.4 from the center of a circle with radius 0.3 gets 0.1, just outside. The formula for one shape is a **signed distance function**, and the numbers it gives across the whole square are the signed distance **field**. The edge, where d = 0, is called the **zero isoline** or **zero level set** in papers and forums.

</details>

### From distances to a mask

A **mask** is a black-and-white picture that says where an effect shows: 1 (white) means show it, 0 (black) means hide it, and the greys in between show it partly. An effect multiplies its color by a mask to decide where it appears.

Turning a distance field into a mask means choosing a rule for each distance:

- **Hard edge:** 1 inside, 0 outside. `step` does this. The edge looks jagged, because each pixel is either fully in or fully out.
- **Soft edge:** fade from 1 to 0 over a short distance past the edge. `smoothstep` does this, and you pick how far the fade reaches.
- **Outline:** take the distance's size and drop its sign, with `abs`. Points just inside and just outside the edge now both count as close, so the mask becomes a band along the edge instead of a filled shape.

The left square shows the distance field each rule reads, and the right square shows the mask it makes. Try each rule, then drag **softness**.

<div data-scene="mask"></div>

## B · Going deeper

### The TSL you type

TSL is three.js's shading language: you build a shader out of JavaScript function calls, and three.js turns it into WGSL on WebGPU, or GLSL on the WebGL 2 fallback. A circle's distance field, and a soft mask made from it:

```js
import { length, oneMinus, smoothstep, uniform, uv, vec3 } from 'three/tsl';
import { MeshBasicNodeMaterial } from 'three/webgpu';

const radius = uniform(0.3);                   // a number JavaScript can change later: radius.value = 0.2
const p = uv().sub(0.5);                       // this pixel's spot, measured from the middle of the square
const d = length(p).sub(radius);               // its distance to the circle: negative inside
const mask = oneMinus(smoothstep(0, 0.02, d)); // 1 inside, fading to 0 just past the edge

const material = new MeshBasicNodeMaterial();
material.colorNode = vec3(mask);
```

Each call is a **node**: one step of the shader. What each one gives back, and its name in GLSL (the Shaders domain) and in Unreal's material editor:

| TSL | What it gives back | GLSL | Unreal node |
| --- | --- | --- | --- |
| `uv()` | The surface's texture coordinates at this pixel, 0 to 1 across | the `uv` attribute, passed on as a varying such as `vUv` | TexCoord |
| `a.sub(b)`, `a.add(b)`, `a.mul(b)` | Subtract, add, multiply | `a - b`, `a + b`, `a * b` | Subtract, Add, Multiply |
| `length(p)` | How far `p` is from (0, 0) | `length` | Length |
| `distance(a, b)` | How far apart two points are | `distance` | Distance |
| `abs(x)` | `x` without its sign | `abs` | Abs |
| `min(a, b)`, `max(a, b)` | The smaller or the larger value | `min`, `max` | Min, Max |
| `step(edge, x)` | 0 below `edge`, 1 from `edge` up | `step` | Step |
| `smoothstep(low, high, x)` | 0 below `low`, 1 above `high`, and a smooth S-curve between | `smoothstep` | SmoothStep |
| `oneMinus(x)` | 1 − x, which flips a mask | `1.0 - x` | OneMinus |
| `uniform(0.3)` | A value you change from JavaScript through `.value` | a `uniform float` | a Scalar Parameter |
| `Fn(...)` | A reusable shader function | a function | a Material Function |

Unreal's **SphereMask** node does the circle and the soft edge in one step, from a distance, a radius, and a hardness.

Chained calls put the value first and move it to the end: `d.smoothstep(0, 0.02)` is `smoothstep(0, 0.02, d)`, and `x.step(edge)` is `step(edge, x)`.

### Shapes you'll reuse

Every shape is the same kind of function: it takes a point and returns the point's distance to the shape's edge. You don't work them out; you copy them. Inigo Quilez keeps a list of dozens of 2D shapes at iquilezles.org/articles/distfunctions2d, and each one ports to TSL line by line:

```js
const circle = Fn(([p, radius]) => length(p).sub(radius));

const box = Fn(([p, halfSize]) => {
  const q = abs(p).sub(halfSize);
  return length(max(q, 0)).add(min(max(q.x, q.y), 0));
});
```

Two tricks work on any shape's distance:

- **Round the corners:** shrink the box, then subtract the same amount from its distance: `box(p, halfSize.sub(r)).sub(r)`. Subtracting a number from a distance grows the shape outward by that much and rounds its corners. That's a rounded rectangle, the shape behind most UI buttons and glows.
- **Make an outline:** `abs(d).sub(thickness)` turns a filled shape into a band `thickness` wide on each side of its edge, like the outline rule above.

### Combining shapes

`min` and `max` join distance fields the way you'd join shapes:

- `min(a, b)` is the union: inside if inside either one.
- `max(a, b)` is the overlap: inside only if inside both.
- `max(a, b.negate())` cuts `b` out of `a`. `negate` flips `b` inside out, so "inside both" becomes "inside `a` and outside `b`".

<div data-scene="combine"></div>

The result still has 0 on the new outline and the right sign on each side, so every mask rule works on it. Its numbers far from the edge are only roughly right, which a mask never notices.

### Getting the edge right

- `step` gives a hard, jagged edge that shimmers when the shape moves. Use `smoothstep` with a short fade.
- A fixed fade, like 0.01, looks soft up close and jagged far away, because it's a distance on the surface, not a number of pixels. For an edge that's always about one pixel soft, fade over `fwidth(d)`, how much `d` changes from one pixel to the next (the Derivatives page in the Shaders domain covers it). This is how SDF text stays sharp at any size:

```js
const edge = fwidth(d);
const mask = oneMinus(smoothstep(edge.negate(), edge, d));
```

### What it costs

- A distance field costs a few math operations for every pixel the shape covers: a subtraction, a length, and a smoothstep. That's GPU work per pixel, in the same range as one texture read, and it uses no GPU memory.
- A painted 1024 × 1024 mask texture costs about 5.6 MB of GPU memory with mipmaps, one texture read per pixel, and it goes blurry up close. The distance field stays sharp at any size.
- Changing the radius or the width is one uniform: no new texture, and nothing to upload.
- Each shape you combine adds its own math to every pixel it covers. Shapes you can't write as a formula, like a logo or a letter, go the other way: their distances are stored in a small texture and read back, which keeps the sharp edges. That's what SDF text does.

### Common mistakes

- **"Masks must be painted textures."** Anything you can describe with distances, like circles, rings, rounded rectangles, and their combinations, is a few math nodes. It stays sharp, costs no memory, and animates by changing a number, like the radius on this page.
- **Measuring from the corner.** `uv()` is (0, 0) in a corner of the surface, so `length(uv())` puts the circle's center there. Subtract 0.5 first to measure from the middle.
- **Stretched circles.** UVs run 0 to 1 on both sides of any rectangle, so on a plane twice as wide as it is tall, a circle made in UV comes out twice as wide as it's tall. Multiply `p.x` by the width over the height before measuring.
- **A hole instead of a shape.** `smoothstep(0, w, d)` on its own is 0 inside and 1 outside. Flip it with `oneMinus`.
- **Swapping smoothstep's edges to flip a mask.** `smoothstep(0.1, 0, d)` gives the flipped mask on WebGPU, whose shading language (WGSL) defines it. GLSL, which TSL writes on the WebGL 2 fallback and which the Shaders domain teaches, leaves the result undefined when the first edge isn't below the second, so it can break on some GPUs. `oneMinus(smoothstep(0, 0.1, d))` works everywhere.

## Exercise · Build it

Write `softRing` in this page's `drill.ts`, at `electives/vfx/sdf/drill.ts`, in your own editor. It gets three values:

- `uv`: the square's UV, 0 to 1 across each side, so (0.5, 0.5) is the middle.
- `radius`: the circle's radius, in the same units (the square is 1 across).
- `width`: how far the ring reaches on each side of the circle.

Return a mask: 1 exactly on the circle of `radius` around the middle, fading smoothly to 0 at `width` away from it on both sides, and 0 everywhere farther out or in. It's the ring the selection-ring effect draws under a part.

Save the file, and the page reloads with your mask next to the reference and the difference between them: orange marks where yours is brighter, blue where it's dimmer. The page measures how closely the two match at three radius and width settings, and at 95% or more it logs the page as done. The sliders change the pictures, not the measurement.

The three.js docs and source are fine to use. AI tools and `/solutions` aren't.

<div data-exercise></div>
