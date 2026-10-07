---
id: jewelry.gem-shader.page
elective: jewelry
kind: page
concepts: [jewelry.gem-shader]
---

# The gem shader

> **In short:** A gem shader follows light into the stone, bounces it off the insides of the facets until it can leave, and shows the room in the direction it leaves.
>
> **Used for:** Diamonds and colored stones in product viewers, crystal trophies and glassware, ice in games, and prisms in science visuals.

## Evidence

Every stone in Spring points to a gem material file of its own. The files hold a handful of numbers each, and the stones' meshes hold nothing but their flat-faceted, closed surfaces.

| Stone | Count | Bends light | Bounces | Absorption | Color | Boost (red, green, blue) |
| --- | --- | --- | --- | --- | --- | --- |
| Diamond | 13 | 2.6 | 5 | 1 | white | 1, 1, 1 |
| Ruby | 4 | 1.77 | 5 | 1.6 | `#e14276` | 1.3, 0.16, 0.9 |
| Yellow sapphire | 2 | 1.77 | 5 | 1.3 | `#f4e2ae` | 1.9, 1.8, 0.5 |
| Emerald | 9 | 1.58 | 5 | 1.8 | `#4fd5b3` | −0.3, 1, 1 |

- **Diamonds bend light harder than real ones.** A real diamond's refractive index (how strongly it bends light) is 2.42; iJewel uses 2.6, for more sparkle. Ruby and sapphire are 1.77, as in real life, and emerald 1.58 is close to real.
- **Dispersion is 0 on every stone.** Rainbow fire is off; the sparkle comes from bounces and the gem lighting file's tiny bright lights.
- **The diamonds' environment is 1.3 times brighter** than the rest of the ring's.
- **Two numbers aren't documented:** `squashFactor` 0.98 and `geometryFactor` 0.5. The shader on this page doesn't use them.

Here are all 28 stones with the metal hidden, each traced with its own settings by the shader this page builds. Pick a kind to see its numbers.

<div data-scene="stones"></div>

## Why it works

### Glass bends light once; a gem traps it

three.js's own see-through option, `MeshPhysicalMaterial` with `transmission`, bends light once as it enters and then shows whatever is behind the stone. That's right for a glass, which is thin and lets light straight through. A cut stone is different: its back facets are angled so that light reaching them is too steep to get out. It reflects off the inside of the surface (**total internal reflection**, from the first unit), crosses the stone, and leaves through the top, back toward you. What you see in a diamond is the room behind *you*, broken into pieces by the facets.

**Analogy: a kaleidoscope.** The picture you see is made of nothing but mirrors folding the same view over and over. The pattern comes from the angles of the mirrors, not from anything painted inside.

Both stones are Spring's center diamond with the same refraction. The room around them is the gem lighting file.

<div data-scene="glassVsTraced"></div>

### Bounces, bending, and fire

Three settings decide most of the look:

- **Bounces:** how many times the shader follows the light off the inside of a facet before giving up. At 0 the stone looks see-through; at 4 or 5 nearly every path has found its way out.
- **Refraction:** how strongly the stone bends light. Diamond's high number is what traps the light. Drop it to glass's 1.5 and the light slips out the back, and the stone goes dull.
- **Dispersion:** red, green, and blue bending by slightly different amounts, so each is traced separately and white light splits into rainbow **fire** at the facet edges. It triples the work, and iJewel leaves it off.

<div data-scene="settings"></div>

### Color comes from distance

A ruby isn't painted red. White light goes in, and the longer it travels inside, the more of its green and blue the stone absorbs, so light that took a long path comes out a deeper red than light that took a short one. That's why a colored stone has dark and bright red facets instead of one flat red. **Absorption** sets how fast the color deepens with distance, and iJewel's **boost** multiplies each color channel on top (the emerald's −0.3 removes red entirely). Distance is measured in stone widths here, so a small ruby and a big one get the same color; a real big ruby would come out darker. The shader also uses the color's hex digits as they are, rather than converting them to linear the way a material's `color` is. Converted, a ruby keeps so little blue that it comes out orange; as is, it comes out the playground's pinker red. iJewel's files don't say which they do, so this is a choice made by eye.

<div data-scene="color"></div>

<details>
<summary>The math, if you're curious</summary>

Bending at a surface follows **Snell's law**: n₁ sin θ₁ = n₂ sin θ₂, where n is each side's refractive index and θ is the angle from the surface's normal. Going from diamond (2.42) out to air (1.0), any angle past about 24.4° has no answer, and that's total internal reflection. For glass (1.5) the limit is about 41.8°, so far more light gets out the back. GLSL's `refract` returns all zeros when there's no answer, which is how the shader knows to bounce.

</details>

## The code

The whole material is in `electives/jewelry/gem-shader/gem-material.ts`. These are the parts that do the work.

### Build a BVH for each cut

```js
import { MeshBVH, MeshBVHUniformStruct } from 'three-mesh-bvh';

const bvh = new MeshBVH(stone.geometry);       // a search tree over the stone's own triangles
const packed = new MeshBVHUniformStruct();
packed.updateFrom(bvh);                         // packed into textures the shader can read
material.uniforms.bvh = { value: packed };
```

The BVH (from the spatial queries domain) is what lets a shader ask "which triangle does this ray hit first?" without testing all of them. Build one per stored shape, not per stone: Spring's 28 stones are 21 shapes.

### Split the light at the surface

```glsl
vec3 view = normalize( vWorldPosition - cameraPosition );
vec3 inward = refract( view, normal, 1.0 / ior );       // the part that bends into the stone
vec3 reflected = environment( reflect( view, normal ) ); // the part that bounces off the surface
float fresnel = f0 + ( 1.0 - f0 ) * pow( 1.0 - dot( - view, normal ), 5.0 ); // more reflection at grazing angles
```

### Follow it inside until it can leave

```glsl
for ( int i = 0; i < 12; i ++ ) {
  if ( ! bvhIntersectFirstHit( bvh, origin, dir, faceIndices, faceNormal, barycoord, side, dist ) ) break;
  vec3 out_ = refract( dir, faceNormal, ior );   // try to leave through the facet it hit
  if ( dot( out_, out_ ) > 0.0 || i >= bounces ) { dir = out_; break; }
  dir = reflect( dir, faceNormal );               // too steep: total internal reflection
  origin = origin + dir * dist;                   // (the real code also nudges off the surface)
}
```

The tracing happens in the stone's own space, measured from the stone itself, so the BVH built once works wherever the stone is placed. The vertex shader hands on the stone's matrices, `modelMatrix` and its inverse, since the fragment shader can't see `modelMatrix` itself.

### Color it and finish

```glsl
vec3 through = environment( leaving ) * pow( tint, vec3( traveled * absorption ) ); // deeper with distance
gl_FragColor = vec4( mix( through, reflected, fresnel ), 1.0 );
#include <tonemapping_fragment>                    // the renderer's tone mapping, like any material
#include <colorspace_fragment>
```

### Put it on the stones

```js
const env = await new EXRLoader().loadAsync('env_gem_001.exr'); // the gem panorama itself, not PMREM
model.traverse((part) => {
  if (part.isMesh && isGem(part)) part.material = gemMaterial(part.geometry, env, GEMS.diamond);
});
```

The shader reads exact directions from the panorama, so it takes the raw `.exr`, not the blurred levels PMREM makes for the metal.

## How it goes wrong

- **"Transmission makes a convincing diamond."** It bends light once and shows the room behind the stone, like glass. A diamond's look comes from light bouncing inside, which only a traced shader gives.
- **"More bounces always look better."** Past about five, almost no light is still inside, so more bounces add cost and change nothing you can see. Too few (0–2) leaves dark or see-through patches.
- **Stones look pale and milky, or flat gray.** They're tracing the metal's studio, which is bright almost everywhere, so the facets have no dark areas for contrast; or a JPG environment, which has no bright lights to flash. Give them the gem environment, in HDR.
- **Stones look like frosted blobs.** Smoothed normals, from the first unit: the surface bends the light at the wrong angles. Make the facets flat.
- **Light leaks out of a stone, or a stone shows streaks.** The mesh has holes, so a ray finds no back facet. Close the mesh.
- **The page slows down with many stones on screen.** Each pixel a stone covers runs up to five BVH searches, three times that with dispersion. On phones, lower the bounces, leave dispersion off, and keep the pixel ratio at 2 or less.
- **Every copy of a stone traces in the same place.** The shader used one shared matrix for the whole material. Pass each stone's own matrix through the vertex shader, as above.
- **Colored stones come out flat or orange.** The color is applied as a paint instead of by distance, or converted to linear first, which wipes out the weaker channels (a ruby's blue).

<div data-mark-done></div>
