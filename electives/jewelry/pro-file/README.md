---
id: jewelry.pro-file.page
elective: jewelry
kind: page
concepts: [jewelry.pro-file]
---

# What's in a pro jewelry file

> **In short:** A pro jewelry file spends its triangles on the metal's curves, keeps every stone small, flat-faceted, and closed, and tags each part so the viewer knows which material it gets.
>
> **Used for:** Judging a model before blaming the lighting, briefing a 3D modeler, checking a supplier's file, and auditing your own product models.

## Evidence

Spring is a ring from iJewel's playground: a wood and red ceramic band, pink ceramic flowers, a ruby butterfly, three pearls, and 28 stones (12 round diamonds, 2 round yellow sapphires, 9 marquise emeralds as leaves, a marquise diamond as the butterfly's body, and 4 rubies as its wings). Opened in three.js, its file holds:

| Parts | Count | Triangles drawn | Share |
| --- | --- | --- | --- |
| Stones | 28 | 15,788 | 5% |
| Metal | 86 | 198,016 | 65% |
| Wood, ceramic, and pearls | 26 | 89,984 | 30% |
| The whole ring | 140 | 303,788 | |

- **The stones are small meshes.** A round diamond is 302 triangles, a marquise 1,072. The metal frame alone is 45,440.
- **The round stones are flat-shaded:** every corner's normal matches its facet to within a degree.
- **No stone has UVs.** Nothing is ever painted on a gem.
- **Every one of its 44 shapes is closed:** no holes and no open edges.
- **No textures and no lights.** The 840 KB file links each material to a separate material file, and the wood's two textures come from there.
- **Shapes are reused, but not perfectly.** A bead shape is drawn 25 times from one copy. But nine identical prong clusters and ten identical marquise stones are each stored separately. Sharing every repeat would cut the triangles stored from 237,000 to 117,000.

Switch between the kinds of parts, then try wireframe to see where the triangles go.

<div data-scene="inventory"></div>

## Why it works

### A stone is a handful of flat mirrors

A cut stone is flat polished faces, its **facets**, meeting at sharp edges. A round brilliant has 57. Each facet is flat, so it faces one direction, and as the stone turns, a facet flashes when that direction crosses something bright. In a file, **flat-shaded** means every corner of a facet carries the facet's own normal (the direction the surface faces; the vertex normals page covers them). So at each sharp edge, the corner is stored once per facet: 550 corners for 302 triangles.

Smoothing does the opposite. It joins corners at the same spot and averages their normals, so the normals bend across every facet, and the sharp flashes smear into soft streaks. More triangles can't fix that, because a real facet is flat however finely you cut it.

**Analogy: a disco ball and a chrome ball.** Both are mirrors. The disco ball's flat tiles throw sharp separate spots, and the chrome ball gives one soft streak.

Both stones below are Spring's center diamond, with the same 302 triangles and the same mirror material standing in for the gem shader. Orbit and watch the flashes.

<div data-scene="facets"></div>

The stand-in is a perfect mirror, so each facet shows a slice of the room in the gem lighting file: that's the room you can see in it. A real diamond's surface reflects only a little of the room. Most of its look is the same room seen *through* the stone, after the light has bounced around inside. "Why the stones must be closed" below shows how that works, and the gem shader unit builds it.

### Metal needs the triangles

Polished metal is a curved mirror. Its reflection follows its normals, and its normals follow its shape, so a flat strip where a curve should be bends the reflection at every edge, and the outline shows corners. That's where Spring spends 65% of its triangles. Drag **detail**, and watch the outline and the way reflections slide across the band.

<div data-scene="band"></div>

### Tags pick the material, not names

The viewer can't tell a gem from its shape, and names lie. Spring's wood material is called "Metal 02", and its emeralds are meshes named `Diamond_Marquise`. iJewel tags each stone's material with its own glTF extension, `WEBGI_materials_diamond`, which carries the gem's settings (how strongly it bends light, how many bounces to trace). GLTFLoader keeps extensions it doesn't know in `material.userData.gltfExtensions`, so your code can read the tag.

### Why the stones must be closed

A mesh is only its surface. There's nothing inside a diamond's mesh, in Blender or in three.js, which is why deleting a face shows an empty hole. So the light inside is worked out by the shader, not modeled. For each pixel, it follows the light in through the facet you're looking at, then asks which of the stone's own triangles the light reaches next. The answer is always a facet on the far side of the same surface, seen from inside.

Diamond bends light so strongly that light reaching those back facets at a steep angle can't get out. It reflects off the inside of the surface instead, which is called **total internal reflection**. After a bounce or two it reaches the top at a gentle enough angle, and leaves toward you. That's the sparkle. The BVH from the spatial queries domain is what makes "which triangle next?" fast enough to ask for every pixel.

A hole is a missing back facet. The question gets no answer, and the light leaves where real light would have bounced.

The white outline is a round diamond cut in half, with nothing inside it. Drag **ray start** and **tilt**, then knock a hole in the back.

<div data-scene="insideRay"></div>

## The code

What a developer types to check a model, and to fix what the check finds. The audit runs on Spring when the page opens. Pick one of your Shopify `.glb` files to see where its triangles are, which stones are smoothed, and which shapes are open. The whole audit is in `electives/jewelry/pro-file/audit.ts`.

### Check a model

```js
THREE.Triangle.getNormal(a, b, c, facing);                // flat? the triangle's own facing...
cornerNormal.fromBufferAttribute(geometry.attributes.normal, i); // ...against each corner's normal
const welded = mergeVertices(positionOnly);               // closed? join corners at the same spot, then
                                                          // any edge only one triangle uses is a hole's rim
const gem = Boolean(mesh.material.userData.gltfExtensions?.WEBGI_materials_diamond); // the tag, not the name
```

<div data-tool="audit"></div>

### Make smoothed stones flat

```js
const flat = stone.geometry.toNonIndexed(); // every triangle gets its own three corners
flat.computeVertexNormals();                // so every corner gets its own facet's facing
stone.geometry = flat;
```

### Give every stone the gem material

```js
model.traverse((part) => {
  if (part.isMesh && part.material.userData.gltfExtensions?.WEBGI_materials_diamond) part.material = gemMaterial;
});
```

### Draw a repeated stone once

```js
const stones = new THREE.InstancedMesh(stoneGeometry, gemMaterial, placements.length);
placements.forEach((matrix, i) => stones.setMatrixAt(i, matrix)); // one geometry, one draw call
```

## How it goes wrong

- **Stones look like frosted glass or soft blobs.** Their normals are smoothed. In Blender, select the stone and use Shade Flat before exporting. In code, use the flattening fix above.
- **"More triangles make a gem look more real."** Subdividing a stone rounds off its facets, and the gem shader's work grows with every triangle it traces against.
- **The metal's outline shows corners, and reflections wobble.** Curves are too coarse, often because a CAD export used low tessellation settings. Raise them, or add a subdivision step before export.
- **Metal and stones are one mesh.** Many CAD exports join everything, and then the viewer can't give the stones their own material. In Blender, Separate › By Material.
- **Open stones.** CAD files often leave a stone as open surfaces. A mirror material hides it, but the gem shader doesn't.
- **The same stone stored many times.** A bigger download for nothing. Share one geometry, or draw many identical stones as one InstancedMesh.

<div data-mark-done></div>
