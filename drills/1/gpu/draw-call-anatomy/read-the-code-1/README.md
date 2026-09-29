---
id: 1.gpu.draw-call-anatomy.read-the-code.1
loop: 1
tier: core
concepts: [gpu.draw-call-anatomy]
mode: read-the-code
context: gpu.draw-call-anatomy/many-small-parts
lenses: []
misconceptions:
  - gpu.draw-call-anatomy/gpu-expensive
---

# Draw call anatomy

> **In short:** A draw call is three.js asking the GPU to draw one geometry with one material, and each one first spends CPU time switching shaders, uploading settings, and binding buffers, so a scene's CPU cost grows with how many draw calls it makes, not with how big they are.
>
> **Used for:** Working out why a model made of thousands of small parts is slow when its triangle count is tiny; knowing what turning on shadows or adding a second material costs; reading `renderer.info` and frame captures; and deciding when merging or instancing is worth the trouble.

## A · The basics

### What one draw call does

Every frame, `renderer.render` walks the scene and makes one draw call for every mesh in view, and one for every group of a mesh that has a material array (the groups page). Each draw call is a short run of WebGL commands, sent from JavaScript:

| Step | WebGL command | three.js skips it when |
| --- | --- | --- |
| Switch to the material's shader program | `useProgram` | The last draw used the same program |
| Upload uniforms: the camera and lights, the material's settings, the mesh's own matrices | `uniform…` | The value is the same as the last one sent to that program |
| Bind the material's textures | `bindTexture` | The same texture is already bound |
| Set state: depth test, blending, which faces to draw | `enable`, `depthMask`, `blendFunc`, … | The setting hasn't changed |
| Bind the geometry's vertex buffers | `bindVertexArray` | The last draw used the same geometry |
| Draw | `drawElements` or `drawArrays` | Never |

Each command is a call from JavaScript into the browser, which checks it and passes it to the graphics driver, which checks it again and turns it into work for the GPU. All of that is CPU time, spent before the GPU draws a single triangle.

**Analogy: tickets at a deli counter.** Every ticket means walking to the right station, setting up the slicer for that order, wrapping, and labeling. Ten tickets for one slice each take far longer than one ticket for ten slices, though the slicing is the same. The slicing is the GPU's work; the tickets are draw calls.

The three shapes turn at different speeds, so each one's matrices change every frame. The readout lists the WebGL commands each one's draw call sent last frame, read from the renderer's actual calls. With one shared material, each draw sends little more than its own matrices and its vertex buffers. A material each adds that material's color; three material types add a program switch to every draw. Anything unchanged since it was last sent is skipped, which is why the lists are short.

<div data-scene="anatomy"></div>

### The count matters more than the size

The GPU's share of a draw call depends on its vertices and pixels. The CPU's share is about the same for every draw call: submitting a 12-triangle bolt takes about as long as submitting a 10,000-triangle housing. So 5,000 bolts can make a frame slow on the CPU while the GPU sits mostly idle. As a rule of thumb, draw call overhead is CPU and driver time, not GPU time, and MDN's WebGL best practices recommend fewer, larger draw calls for the same reason.

Change the number of parts, give each part a material array, and turn shadows on. The readout shows `renderer.info.render.calls` and the WebGL commands behind them; the floor grid is hidden so it doesn't add to the count.

<div data-scene="count"></div>

## B · Working knowledge

### Counting draw calls

```js
renderer.render(scene, camera);
console.log(renderer.info.render.calls);     // draw calls in that render() call
console.log(renderer.info.render.triangles); // and the triangles they drew
```

- **One per visible mesh, line, points, or sprite** in the camera's view. Meshes outside it are skipped on the CPU (frustum culling); hidden behind something isn't the same as out of view, which the depth buffer and early-z page covers.
- **One per group** for a mesh with a material array, even when two groups share a material.
- **A Group draws nothing.** An InstancedMesh is one draw call for all its copies.
- `info.render` holds the last `render()` call only; the measurement tools page covers frames with more than one.

### Many small parts

A model from CAD or Blender often arrives as hundreds of meshes, one per bolt, bracket, and panel. Sharing one material and one geometry saves memory, not draw calls: 500 bolts are 500 draw calls. The fixes, merging geometries, `InstancedMesh`, and `BatchedMesh`, are on the draw call reduction page in the optimization domain. This page is about seeing the cost.

### Shadows repeat the draw calls

```js
renderer.shadowMap.enabled = true;
sun.castShadow = true;
for (const part of parts) part.castShadow = true;
```

Each shadow-casting light draws every casting mesh in its view again, into its shadow map, so 200 casting parts become 400 draw calls. A point light draws its casters six times, once per direction. Set `castShadow` only on the meshes whose shadows show.

### Multi-material meshes

```js
const crate = new Mesh(new BoxGeometry(), [wood, wood, wood, wood, label, wood]); // six groups
```

That's six draw calls, one per group, even though it uses two materials. The groups page covers `mergeGroups`, which joins groups that share a material.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
