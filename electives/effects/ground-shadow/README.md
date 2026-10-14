---
id: effects.ground-shadow.page
elective: effects
kind: page
concepts: [effects.ground-shadow]
renderer: webgpu
---

# Baked soft ground shadow

> **In short:** A soft shadow worked out once from hundreds of light directions and laid on the floor as a picture, so after that the floor costs almost nothing.
>
> **Used for:** products on a plain floor, configurators between part changes, phones, and still renders.

## What it adds

### Hundreds of lights, averaged once

A live shadow map comes from one light direction: one crisp outline, the same darkness throughout. The **bake** averages the shadows of one light moved to 400 spots in a patch of sky about 40° across, once, and lays the result on the floor as a picture: darkest where the watch touches the floor, fading outward, as under a softbox.

Think of 400 lamps in a cluster, and for each spot on the table, counting how many of them it can see.

The tactile elective's Shadows and grounding page teaches live shadow maps and the other ways to ground a product, and the jewelry elective's Shadows, glow, and smooth edges page builds this bake step by step. This page covers what each costs and when the bake is worth it.

Switch between **baked soft** and **live, one light**: it's the same light, made big or kept small. **Just the shadow** hides the watch. Then pick **moved**: the baked shadow stays where it was baked, because it's a picture. Press **bake again**.

<div data-scene="adds"></div>

A live shadow doesn't always look better. It's right while things move; for a product sitting still, the baked one looks more like a photo and costs less.

## What it costs

### Paid once, then nearly free

A live shadow draws the watch a second time every frame, from the light, into the shadow map. A bigger map means more pixels to fill, and `shadow.radius` means more samples for every floor pixel, but every frame pays for both.

The bake costs about as much as a live shadow while it runs, for 400 frames here, then stops. After that the shadow is one draw of 2 triangles and one texture read per floor pixel. The two pictures it keeps are 1024 × 1024 at 8 bytes a pixel, 8 MB each.

Try each setting at pixel ratio 1, then at 2, pressing **time it** for each; **baked** is timed once the bake is finished. The second line counts what the GPU is asked to draw each frame, and those numbers are steady: 24 draws and 124k triangles baked, 42 and 246k with the live shadow, 48 and 279k while baking.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer.

On an M4 Pro Mac, every setting cost between about 0.2 and 1 ms a frame on WebGPU and 0.5 and 2.5 ms on WebGL 2, two runs each, and running them twice moved some times more than the gaps between them. A desktop GPU has room to spare for one watch; trust the counts here, and measure on a phone, where 120k more triangles a frame is a real share.

## When to use it

The watch's live WebGi page uses a live shadow from its one light, `light_0`, softened a little (radius about 1.07), plus a contact shadow on its ground. The settings saved inside the file, from an older WebGi, have a shadow baker set up (a randomized light, a 1024 map, up to 400 frames) and switched off: `bakedShadows: false`. The iJewel jewelry playground bakes its ground shadow over 400 frames.

| Use it | Skip it |
| --- | --- |
| The product sits still and only the camera moves | Parts move, open, or swap every few seconds |
| Phones and low-power laptops | A light the viewer can move |
| A soft studio look under one product | Shadows on the product itself: the bake only darkens the floor |

Cheaper still: bake once ahead of time, here or in Blender, and ship the picture as a PNG. A configurator then bakes again only when a part changes the outline.

## The code

### Set up the bake

```ts
const shadow = softGroundShadow(renderer, watch, { toward: key.position, cone: 20, frames: 400 });
scene.add(shadow.overlay); // a black square; its opacity comes from the baked picture
key.castShadow = false;    // no shadow map every frame
```

### Each frame until it's done

```ts
shadow.step(4); // four more light directions; does nothing once all 400 are in
renderer.render(scene, camera);
```

The module is `electives/effects/ground-shadow/bake.ts`, the WebGPU version of the jewelry elective's `bakedGroundShadow`, which is the one for WebGLRenderer and where the steps inside are taught. Its copy of the watch shares the watch's geometry, so it adds no GPU memory for shapes.

### Bake again when the outline changes

```ts
watch.position.x += 1.4;
shadow.restart(); // the next step replaces the picture, then the average builds up again
```

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| The shadow stays put when the product moves | It's a picture, baked once | `shadow.restart()` after anything that changes the outline |
| Grainy or banded shadow | Too few directions averaged | 200 to 400 directions |
| The shadow is mirrored, falling on the wrong side | The baked picture is read upside down | Flip the overlay's v (`uv().flipY()` here) and check both backends |
| A hard square edge on the floor | The baked square is smaller than the shadow | Raise `size` |
| A soft shadow and a sharp one together | The live shadow is still on | `key.castShadow = false` |
| Glass casts a solid shadow | See-through parts in the caster | Leave transparent and transmissive parts out of the bake |

<div data-mark-done></div>
