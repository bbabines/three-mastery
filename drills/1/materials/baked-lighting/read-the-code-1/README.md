---
id: 1.materials.baked-lighting.read-the-code.1
loop: 1
tier: light
concepts: [materials.baked-lighting]
mode: read-the-code
context: materials.baked-lighting/static-rooms
lenses: []
misconceptions:
  - materials.baked-lighting/reacts-to-moving
---

# Baked lighting

> **In short:** Baked lighting paints light and shadow into a texture ahead of time, so it's nearly free to draw but can never change.
>
> **Used for:** Showrooms whose walls never move, dark creases between parts, soft shadows under products, and lighting on phones.

## A · The basics

### Light painted in ahead of time

Live lights and shadows are worked out every frame, which is wasted work for things that never move. **Baking** works the lighting out once, in a tool like Blender, with slow, high-quality lighting, and saves the result as a texture. A **lightmap** holds how much light reached each spot, and an **ambient occlusion (AO) map** holds how tucked away each spot is, darkest in creases and corners.

Drawing it is then one texture read per pixel. The catch is in the name: it's baked. Move a crate and its baked shadow stays on the floor where the crate used to be.

**Analogy: a painted backdrop.** A stage backdrop can show perfect sunset light, but walk an actor in front of it and the painted shadows don't move with them.

Slide the crate, first with the baked lightmap and then with a live shadow.

<div data-scene="bakedVsLive"></div>

## B · Working knowledge

### The second set of UVs

A lightmap needs every surface to have its own spot in the texture, so it usually reads a second set of UVs, `uv1`. Each texture's `channel` picks which set it reads:

```js
geometry.setAttribute('uv1', bakedUVs);
bakedLight.channel = 1; // read uv1, not uv
floor.material.lightMap = bakedLight;
floor.material.lightMapIntensity = 1.5; // tuned by eye
```

`channel` defaults to 0, so forgetting it puts the light in the wrong places; `GLTFLoader` sets it for you when a file has a second set. A lightmap saved as PNG or JPG is sRGB, and one saved as EXR or HDR is linear.

### AO maps

```js
material.aoMap = occlusion; // reads the red channel
material.aoMapIntensity = 1;
```

AO darkens only the soft, all-around light: ambient, hemisphere, the environment, and a lightmap. A directional or spot light still lights a crease fully, since the crease is hidden only from the light around it, not from that one lamp.

### A baked shadow catcher

```js
const shadow = new Mesh(
  new PlaneGeometry(1.2, 1.2),
  new MeshBasicMaterial({ map: softShadow, transparent: true, depthWrite: false }),
);
```

A plane with a pre-rendered soft shadow, lifted just above the floor, grounds a product for the cost of one texture. It doesn't move with the product; for that, use a live `ShadowMaterial` plane.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
