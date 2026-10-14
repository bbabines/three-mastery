---
id: effects.hdri-ground.page
elective: effects
kind: page
concepts: [effects.hdri-ground]
renderer: webgpu
---

# Projected HDRI ground

> **In short:** The bottom half of the lighting photo is bent onto a flat floor under the product, so the photo's own floor looks like what it stands on.
>
> **Used for:** products shown in a photographed room, furniture and cars on a real floor, backgrounds that match the lighting exactly, and quick scene mockups.

## What it adds

### The photo's floor, laid flat

An HDRI is a photo taken in every direction from one spot, usually a tripod. Shown as a plain background, it's infinitely far away: the product floats in front of it, and its floor sits far below, never under the product.

`GroundedSkybox` fixes that. It's a big sphere with the photo on the inside, with the bottom pressed flat into a floor. Two numbers set it up. **Height** is how high the photo's camera stood, in your scene's units: it sets how big the floor's planks and tiles come out next to the product. **Radius** is the sphere's size: the floor stays flat out to about two-thirds of it and then curves up into the walls, and the camera has to stay inside it.

Think of a photo printed on the inside of a bowl, with the bottom of the bowl flattened into a tabletop.

Start in the **wood-floor room** with the **projected ground**, then try **flat background** to see the watch float, and **bench floor** for the plain studio floor. Change the **height**: low shrinks the room around the watch like a dollhouse, high makes the watch a small thing on a big floor. A small **radius** bends the walls up right behind it. Then try **low, far**: the low view is where a projection shows its seams.

Last, try **the watch's studio** and the **overcast sky**. Neither photo has a floor. The watch's studio is a light box of panels, so its lights get smeared across the ground; the sky's lower half is only a gray fill. Not every HDRI works as a floor: it needs a real, fairly plain floor under the tripod, and nothing tall near the camera, since everything in the photo is flattened onto the ground.

<div data-scene="adds"></div>

The photo's floor is a picture, so it can't take a shadow. The soft shadow under the watch is the baked one from the ground shadow page, laid on top.

## What it costs

### A background with a floor in it

It's one sphere drawn behind everything each frame, with one texture read per pixel, about the cost of showing the panorama as a background. The default sphere is 65k triangles (`resolution` 128); 32 cuts that to about 4k. There's no new texture memory when the same photo already lights the scene: a 2048 × 1024 HDRI is 16 MB on the GPU either way. The real costs are the download (the room here is a 6.5 MB `.hdr`) and the photo's resolution, which stretches thin far from the tripod.

Try each backdrop at pixel ratio 1, then 2, pressing **time it** for each. The second line counts what each frame draws.

<div data-scene="costs"></div>

**Time it** draws frames back to back and waits for the GPU once at the end: that average is what a frame costs. Then it draws frames one at a time, waiting for each, which adds the wait itself, so that number usually reads longer.

On an M4 Pro Mac, two runs each, every backdrop cost between about 0.2 and 0.9 ms a frame on WebGPU and 0.4 and 2 ms on WebGL 2, at either pixel ratio, with no difference larger than the noise. The sphere's extra 65k triangles are the only steady difference.

## When to use it

The watch's WebGi file saves a ground-projection setting (a radius of 100 and a tripod height of 10) and keeps it switched off; its live page uses its own floor with a contact shadow, the look most product pages want: white, polished (roughness 0.25, metalness 0.78), on a white background. A projected floor is for when the room is part of the picture.

| Use it | Skip it |
| --- | --- |
| The room or location sells the product | A clean white or gray product page |
| An HDRI with a real, plain floor | HDRIs of sky, studio panels, or a cluttered floor |
| The product sits on the floor | Products that need to reflect or shadow on the floor in detail |

Cheaper still: a plain floor plane and a soft baked shadow. That's also what to use when the HDRI's floor won't project well.

## The code

### Project the floor

```ts
import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js';
photo.mapping = THREE.EquirectangularReflectionMapping;
scene.environment = photo; // the same photo lights the product
const ground = new GroundedSkybox(photo, 15, 120); // height, radius
ground.position.y = 15; // its floor at y = 0
scene.add(ground);
```

### Keep it in view

```ts
camera.far = 2500;               // farther than the sphere, or its far side is cut off
camera.updateProjectionMatrix(); // far only takes effect after this
controls.maxDistance = 16;       // the camera stays well inside the radius
```

### Change height or radius

```ts
scene.remove(ground); ground.geometry.dispose(); ground.material.dispose();
ground = new GroundedSkybox(photo, newHeight, newRadius); // the numbers are baked into the shape
```

`GroundedSkybox` is an ordinary mesh, so the same lines work on WebGLRenderer. WebGPU also has a TSL version, `getGroundProjectedNormal(radius, height)` in `three/addons/tsl/utils/GroundedSkybox.js`, which works out the floor per pixel for a `scene.backgroundNode`, so the numbers can change without a new shape.

## How it goes wrong

| Symptom | Cause | Fix |
| --- | --- | --- |
| The product floats over a distant floor | The photo is a flat `scene.background` | Use `GroundedSkybox` |
| The room looks like a dollhouse, or the product looks tiny | `height` doesn't match the scene's scale | Raise or lower height until the floor's features look right next to the product |
| Walls bend up just behind the product | Radius too small | About 8 × height |
| Black where the sky should be | The sphere is past `camera.far`, or the camera left the sphere | Raise `far`; cap `controls.maxDistance` |
| Lamps or furniture smeared across the floor | The photo has no plain floor | Pick an HDRI shot over an open floor |
| No shadow under the product | The photo's floor can't receive one | Lay a baked shadow on top |
| The floor is blurry far away | The photo's pixels are stretched thin there | A higher-resolution HDRI, or keep the camera low and close |

<div data-mark-done></div>
