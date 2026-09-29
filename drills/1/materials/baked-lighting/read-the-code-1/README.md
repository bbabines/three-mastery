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

> **In short:** Baked lighting is light and shadow worked out ahead of time, usually in a 3D tool, and stored in a texture, a lightmap or an ambient occlusion (AO) map, so it costs almost nothing to draw but never changes when anything moves.
>
> **Used for:** Showroom and room tours whose walls and floors never move; the dark creases between parts that make a model look solid; a soft shadow under a product on a web page; and phones, where live lights and shadows cost too much.

## A · The basics

### Light painted in ahead of time

Live lights and shadows are worked out every frame. For things that never move, that's wasted work: the answer is the same every time. **Baking** works it out once, in a tool like Blender, with slow, high-quality lighting (soft shadows, light bouncing between surfaces), and saves the result as a texture:

- a **lightmap** holds how much light reached each spot;
- an **ambient occlusion (AO) map** holds how tucked-away each spot is, darkest in creases and corners where surrounding light can't reach.

Drawing it is then one texture read per pixel. The catch is in the name: it's baked. Move a crate and its baked shadow stays on the floor where the crate used to be.

**Analogy: a painted backdrop.** A stage backdrop can show perfect sunset light, but walk an actor in front of it and the painted shadows don't move with them.

Slide the crate, first with the baked lightmap and then with a live shadow.

<div data-scene="bakedVsLive"></div>

## B · Working knowledge

### The second set of UVs

A lightmap needs every surface to have its own spot in the texture, which a tiling color texture doesn't, so it usually lives on a second UV set, `uv1`. The UVs page covers the attribute; each texture's `channel` picks which set it reads:

```js
geometry.setAttribute('uv1', bakedUVs);
bakedLight.channel = 1; // read uv1, not uv
floor.material.lightMap = bakedLight;
floor.material.lightMapIntensity = 1.5; // tuned by eye
```

- **`channel` defaults to 0.** Forget it and the lightmap reads the color UVs and lands in the wrong places. `GLTFLoader` sets `channel` and loads `uv1` for you when the file has a second set.
- **Color space:** a lightmap saved as PNG or JPG is sRGB (`SRGBColorSpace`); one saved as EXR or HDR is linear (the color spaces page).
- A lightmap adds its light to the live lights, so a scene lit mostly by its bake keeps its live lights low.

### AO maps

```js
material.aoMap = occlusion;        // reads the red channel
material.aoMapIntensity = 1;
```

AO darkens only the soft, all-around light: ambient, hemisphere, the environment, and a lightmap. A directional or spot light still lights a crease fully, since the crease is only hidden from the light around it, not from that one lamp. Like a lightmap, it reads the UV set its `channel` names. The channel packing page shows AO sharing a texture with roughness and metalness.

### A baked shadow catcher

```js
const shadow = new Mesh(
  new PlaneGeometry(1.2, 1.2),
  new MeshBasicMaterial({ map: softShadow, transparent: true, depthWrite: false }),
);
```

A plane with a pre-rendered soft shadow picture, lifted just above the floor, gives a product a grounding shadow for the cost of one texture. It doesn't move with the product; for that, use a live `ShadowMaterial` plane (the shadows page).

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
