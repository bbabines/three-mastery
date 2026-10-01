---
id: vfx.flipbooks.page
elective: vfx
kind: page
concepts: [vfx.flipbooks]
renderer: webgpu
---

# Flipbooks

> **In short:** A flipbook plays a texture atlas by mapping the sprite's UV into one cell at a time.
>
> **Used for:** Explosion sprites, smoke puffs, and animated icons.

## A · The basics

An atlas is a sheet of small pictures. A sprite keeps one rectangle of geometry and one texture; to play an animation, it changes which cell its UVs read. The highlighted grid cell below is the frame being sampled. Move the slider past the first row: in this bottom-left-origin atlas, frame 4 begins the row above frame 0.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const cell = vec2(mod(frame, columns), floor(frame.div(columns)));
const atlasUv = uv().add(cell).div(vec2(columns, rows));
material.colorNode = texture(atlas, atlasUv).rgb;
```

| TSL | GLSL | Unreal | Purpose |
| --- | --- | --- | --- |
| `uv()` | interpolated UV | TexCoord | Local position within a frame. |
| `add(cell).div(grid)` | UV arithmetic | Add / Divide | Moves and scales UV into one atlas cell. |
| `texture(atlas, atlasUv)` | `texture` | Texture Sample | Reads the chosen frame. |

The row direction depends on the atlas and the UV origin; frame 0 is not automatically top-left. Wrap the frame index when animation loops. Blending adjacent frames requires two texture samples, so use it only when the smoother motion matters. One atlas avoids switching textures each frame but still occupies GPU memory.

**Common mistake:** dividing the frame by the number of rows to find the row. The row changes after every `columns` frames.

## Exercise · Build it

Write `frameUv` in `drill.ts`. It receives a UV inside one frame, a frame index, columns, and rows. Return the atlas UV using the lower-left origin, wrap frames, and leave the input alone. This is a number check, so run `npm run drill -- electives/vfx/flipbooks`; the page does not score pixels.
