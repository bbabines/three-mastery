---
id: jewelry.small-textures.page
elective: jewelry
kind: page
concepts: [jewelry.small-textures]
---

# Small tiling textures and triplanar mapping

> **In short:** A small photo of a real material that repeats without seams, projected onto the part from three sides, looks real at any size and needs no UVs.
>
> **Used for:** Wood and stone inlays, leather and fabric swatches, terrain in games, and CAD parts with no usable UVs.

## Evidence

Spring's only textured part is its wood band: one mesh, `Tube005`, 42,112 triangles, whose material (named "Metal 02") links to iJewel's `wood_brown` material file. That file holds:

| Setting | Value |
| --- | --- |
| Color map | `wood_329bd7b8b5.jpg`: 1024 × 1024, 255 KB, marked sRGB, repeating |
| Roughness map | `wood_bump_5b98b6225c.jpg`: 1024 × 1024, 420 KB, marked `srgb-linear`, set to clamp at its edges |
| Base values | color `#ca997d`, roughness 0.297, metalness 0.144, both sides drawn |
| Triplanar mapping | on: scale 1, blend 6, offset 0 |

- **The two maps are one picture.** The roughness map is pure gray, and pixel by pixel its brightness follows the color map's (a correlation of 0.997, measured in a browser canvas). Its file name says "bump", but the material uses it as roughness.
- **Both tiles are seamless.** Going off the right edge and back in at the left is no bigger a jump than between any two neighboring pixels (8.8 against 8.1 steps out of 255, on average), and the same top to bottom.
- **The band has UVs, and iJewel doesn't use them.** With triplanar on, the texture is projected instead. The band's own UVs spread one tile over the whole band unevenly.
- **What the files don't say:** whether iJewel projects measured from the object itself or in the world, what unit its scale uses, or how its shader copes with a roughness map set to clamp. The code below makes its own choices and says why.

The band as iJewel draws it, then with its own UVs instead. Switch between them, and orbit.

<div data-scene="band"></div>

## Why it works

### Three projectors instead of a sewing pattern

**UV mapping** gives every corner of the mesh a spot on the image (its UVs), so the image is laid on like fabric cut from a sewing pattern. Someone has to cut the pattern, an **unwrap**: where it's cut there's a seam, and where it's stretched the texture stretches. CAD exports come with patterns nobody cut by hand, like the band's.

**Triplanar mapping** skips the pattern. **Analogy: three slide projectors**, aimed at the part from the side, from above, and from the front, all showing the same tile. Each spot takes its color mostly from the projector it faces most squarely, and where the surface turns from one to the next, it mixes the two. The tile is seamless, so each projector's picture repeats forever without an edge, and any shape is covered.

**Blend** sets how quickly one projector hands over to the next. In the scene above, pick **projectors** to see each one's share as a color, and drag **blend**: low smears the pictures together on every curve, and very high turns the handover into a line.

### The roughness map is what reads as wood

The color map gives the pattern, but under a studio environment, wood is sold by its reflections. The roughness map is the color map's gray copy, so it's darkest on the grain: roughness 0.297 times the gray makes the grain 0.13 and the pale wood between it 0.22. Lower roughness is glossier, so the studio's lights and black panels reflect sharper on the grain and blurrier between, and as the ring turns the highlights break up along the grain. Turn the map off, keeping the same average roughness everywhere, and the grain looks printed on.

<div data-scene="grain"></div>

The scene also takes your own image. It uses it twice, once as the color map and once, unconverted, as the roughness map: the roughness code reads only the green channel, which is close to a gray copy. On the wood, the green channel is within 5.5 steps out of 255 of iJewel's gray file, on average, which would save its 420 KB download.

### A color map and a data map

A JPG stores color as **sRGB**: packed the way screens expect, with more of its 256 steps spent on the darks. Lighting needs **linear** numbers, where twice the number is twice the light. Marking the texture `SRGBColorSpace` makes three.js convert as it reads. The roughness map holds roughness, not color, so its numbers are used as they are: a **data map**, left at `NoColorSpace`. iJewel's `srgb-linear` does the same here: no conversion.

Each mistake has its own look. Try both.

<div data-scene="colorSpaces"></div>

### Small is enough

**Texel density** is how many texture pixels (texels) land on each screen pixel. Past one, the extra detail is averaged away: the GPU reads a smaller copy of the texture, a **mipmap**, made when it's uploaded. Say the ring fills 1,000 device pixels across and the tile repeats twice across it. Each copy covers about 500 pixels, so a 1024² tile already gives two texels per pixel. A 4K tile would give eight, all averaged away, and it costs 16 times the GPU memory: 89 MB with mipmaps instead of 5.6 MB.

<details><summary>The math, if you're curious</summary>

The copy the GPU reads is picked by the **mip level** (also called the level of detail, LOD): about log₂ of the texels per screen pixel. A 4096 tile over 500 pixels is about 8 texels per pixel, log₂ 8 = 3, so the GPU reads level 3, which is 512². The 4K file is drawn as a 512 one.

</details>

### Skipping UVs saves a little; projecting costs a little

UVs are 981 KB of Spring's 7.2 MB of geometry once unpacked, 14%. The download saving is smaller, since the file is Draco-compressed. Skipping them also skips the unwrap, and the seams and stretching CAD unwraps bring. The bigger saving is the repeat itself: one small tile instead of a texture big enough to cover the whole band at the same sharpness.

The cost is reading each map three times instead of once, plus the mixing: GPU work for every pixel the part covers, not for each triangle. It's usually small next to the gem shader's work. It shows on phones at a high pixel ratio when the part fills the screen. The fixes: skip a projector whose share is near zero, use a two-projector version (**biplanar** mapping), or bake the projection into an ordinary UV texture before shipping.

### Where convincing textures come from

- **Photo-scanned libraries:** Poly Haven and ambientCG give away seamless materials made from photos, under CC0 (free for any use, no credit needed), each with its color, roughness, and normal maps at several sizes. Take the 1K or 2K set.
- **Your own photo:** flat, even light, shot straight on. To make it seamless, wrap it by half its size so the edges meet in the middle (Photoshop's Filter › Other › Offset), and paint out the seam.
- **Roughness from the color:** a gray copy, as iJewel does, with its levels adjusted until the shine looks right, or the color map's own green channel.
- **Then shrink it:** resize to 1024², and for GPU memory, compress to KTX2, which stays compressed on the GPU (the KTX2 page covers it). A JPG is small to download but unpacks to full size: 5.6 MB each.

## The code

What a developer types to texture a part this way. The whole module, with the vertex half and the projectors view, is in `electives/jewelry/small-textures/triplanar.ts`.

### Load the two maps

```js
const map = await loader.loadAsync('wood.jpg');
map.colorSpace = THREE.SRGBColorSpace;                         // a color map: sRGB becomes linear light
const roughnessMap = await loader.loadAsync('wood_bump.jpg');  // a data map: left at NoColorSpace
for (const t of [map, roughnessMap]) t.wrapS = t.wrapT = THREE.RepeatWrapping; // tile forever
```

### Project from three sides

The vertex shader passes `position` and `normal` on, measured from the object itself, as `vTriplanarPosition` and `vTriplanarNormal`. The fragment shader mixes three reads:

```glsl
vec3 w = pow(abs(normalize(vTriplanarNormal)), vec3(triplanarBlend)); // how squarely it faces each axis
w /= w.x + w.y + w.z;                                     // shares that add up to 1.0
vec3 p = vTriplanarPosition * triplanarScale;             // tiles per unit, measured from the object
diffuseColor *= texture2D(map, p.zy) * w.x + texture2D(map, p.zx) * w.y + texture2D(map, p.xy) * w.z;
```

### Swap it into MeshStandardMaterial

```js
material.onBeforeCompile = (shader) => {
  shader.uniforms.triplanarScale = scale;              // { value: 1.0 }, changeable later
  shader.fragmentShader = shader.fragmentShader
    .replace('#include <map_fragment>', TRIPLANAR_MAP)  // was one read at vMapUv
    .replace('#include <roughnessmap_fragment>', TRIPLANAR_ROUGHNESS);
};
```

Projecting measured from the object itself, rather than in the world, keeps the grain stuck to the part as it turns. The roughness chunk does the same three reads and keeps the green channel, as three.js's own does.

### Use it

```js
const wood = triplanarMaterial({ map, roughnessMap, color: 0xca997d, roughness: 0.297, metalness: 0.144, scale: 1, blend: 6 });
band.material = wood;
wood.userData.triplanar.scale.value = 2; // a uniform: changes live, same shader
```

### Change a map after it's in use

```js
map.colorSpace = THREE.SRGBColorSpace;
map.needsUpdate = true;          // a color space applies when the texture is uploaded
material.roughnessMap = null;
material.needsUpdate = true;     // adding or removing a map builds a different shader
```

## How it goes wrong

- **"Realistic textures have to be 4K."** Big downloads, phones running out of memory, and nothing sharper on screen, because the GPU averages the extra texels away. What makes a texture look real is a photo source, a seamless repeat, and a roughness map. Use a 1K tile and repeat it.
- **Stretched or seamed wood on a CAD part.** Its UVs came from an automatic unwrap. Project the texture instead, or unwrap it properly in Blender (mark seams, then Unwrap).
- **Pale, washed-out wood.** The color map was left at `NoColorSpace`, the default for a texture loaded by hand with TextureLoader. GLTFLoader marks a model's base color map sRGB itself. Set `map.colorSpace = THREE.SRGBColorSpace`.
- **"Every texture should be marked sRGB."** Then the wood is as glossy as varnish: the roughness map was marked sRGB, so its numbers were decoded as if they were color, and every value dropped. Leave data maps at `NoColorSpace`; in Blender, set their image node to Non-Color.
- **"A texture needs the mesh's UVs."** The band ignores its own; the shader works out where to read from the surface's position and facing.
- **"The color map is what makes it look real."** Without the roughness map, the grain is a print on a uniform sheen. The variation in shine sells it.
- **The same knot every few millimeters.** The tile repeats too often, so a standout feature becomes a pattern. Lower the scale so each tile covers more, or pick a tile without a standout feature.
- **A smeared mix at 45°, or a visible seam.** Blend too low, or too high. Somewhere between 4 and 8 usually hides the handover.
- **Grain sliding across a turning part.** The projection is in the world. Project measured from the object itself.
- **Changed a color space, and nothing happened.** Set `texture.needsUpdate = true`, and `material.needsUpdate = true` after adding or removing a map.

<div data-mark-done></div>
