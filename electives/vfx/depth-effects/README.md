---
id: vfx.depth-effects.page
elective: vfx
kind: page
concepts: [vfx.depth-effects]
renderer: webgpu
---

# Depth-based effects

> **In short:** A translucent effect can read the opaque scene's depth and fade as it approaches another surface.
>
> **Used for:** Smoke against the ground, heat haze near a wall, and water edges.

## A · The basics

A smoke puff that intersects the floor often ends in a sharp straight line. A soft particle measures how far its pixel is in front of the floor and lets its opacity approach zero as the gap closes. In the scene, the left puff has a hard intersection and the right uses scene depth to soften it.

<div data-scene="preview"></div>

## B · Going deeper

### The TSL you type

```js
const sceneZ = perspectiveDepthToViewZ(viewportDepthTexture(), cameraNear, cameraFar);
const gap = positionView.z.sub(sceneZ);
material.opacityNode = puffMask.mul(gap.div(fadeDistance).clamp(0, 1));
material.depthWrite = false;
```

| TSL | GLSL | Unreal | Purpose |
| --- | --- | --- | --- |
| `viewportDepthTexture()` | depth texture sample | SceneDepth | Reads the opaque surface behind the puff. |
| `positionView.z` | view-space depth | PixelDepth | Gives the puff's own depth. |
| `gap.div(distance).clamp(0,1)` | depth-gap fade | DepthFade | Converts the gap into opacity. |

Compare both depths in the same space; raw device-depth values are nonlinear under perspective and should not be subtracted as world distances. The pinned r186 depth nodes convert them to view-space distances. Its bundled `SoftParticles` add-on emits invalid GLSL on the WebGL 2 fallback, so this page uses the direct node expression. A depth read and broad translucent layers cost pixel work; drawing fewer large puffs matters more than changing one small arithmetic step.

**Common mistake:** searching for a texture checkbox called “soft particles.” The fade is a comparison with the *current scene*, so a texture alone cannot know where the floor is.

## Exercise · Build it

Write `softFade` in `drill.ts` for positive camera distances. Return 0 at or behind the opaque surface, 1 at least `fadeDistance` in front, and a linear value between. Run `npm run drill -- electives/vfx/depth-effects`; this numeric invariant is checked by Vitest.
