---
id: 1.materials.materials-tour.read-the-code.1
loop: 1
tier: light
concepts: [materials.materials-tour]
mode: read-the-code
context: materials.materials-tour/product-finish
lenses: []
misconceptions:
  - materials.materials-tour/all-react
---

# Tour: materials

> **In short:** A material is the look a mesh wears, and three.js's built-in ones run from flat color to surfaces that react to every light.
>
> **Used for:** Price tags that show their exact color, real-looking product finishes, quick debug views, and cartoon looks.

## A · The basics

### A mesh is a shape plus a look

A `Mesh` takes a geometry and a material. The geometry is the shape, and the **material** is the look: its color, whether it's matte or shiny, and above all whether it reacts to the lights in the scene. A material that reacts to lights is **lit**; one that ignores them is **unlit**.

Each material type is a small program the GPU runs for every pixel the mesh covers, called a **shader**. A lit material works out how much light reaches each pixel from each light, so every light adds to its cost.

**Analogy: finishes on a product sample.** A printed sticker looks the same under any lamp. Matte paint shows where the lamp is, and polished metal mirrors the whole room: the sticker is unlit, and the paint and the metal are lit.

### The members, at a glance

| Material | What it is | Pick it for | Cost |
| --- | --- | --- | --- |
| `MeshBasicMaterial` | Flat color or a picture; ignores lights | Labels and UI that must show their exact color | The least |
| `MeshLambertMaterial` | Matte, with no shine | Paper, plaster, matte parts on low-end phones | Low, per pixel and per light |
| `MeshPhongMaterial` | Matte plus a shiny highlight | Glossy plastic, when Standard costs too much | A little more than Lambert |
| `MeshStandardMaterial` | Physically based: `metalness` and `roughness` | Most real products; glTF models load with it | More per pixel; the usual choice |
| `MeshPhysicalMaterial` | Standard plus clearcoat, sheen, transmission | Car paint, fabric, glass | Standard's, plus each extra turned on |
| `MeshToonMaterial` | Light in flat bands, like a cartoon | A stylized look | Low |
| `MeshMatcapMaterial` | Shading from a picture of a lit ball; ignores lights | A fixed, sculpting-app look | Very low |
| `MeshNormalMaterial` | Colors from the way each surface faces; ignores lights | Checking normals | Very low |
| `MeshDepthMaterial` | Gray by distance from the camera; ignores lights | Checking depth; three.js draws shadows with it | Very low |

The diffuse, specular, and PBR metal and roughness pages open up Lambert, Phong, and Standard, and the environment maps page covers reflections.

Try each material on the same part, then move the light.

<div data-scene="members"></div>

## B · Working knowledge

### Labels and UI: Basic

```js
const tag = new Mesh(plane, new MeshBasicMaterial({ map: priceTexture }));
```

It shows its color or its `map` exactly, whatever the lights do, so a 3D shape made with it looks flat. Tone mapping still changes its color unless you set `toneMapped: false`.

### Product finishes: Lambert, Standard, and Physical

```js
new MeshLambertMaterial({ color: '#9aa0ab' }); // matte and cheap
new MeshStandardMaterial({ color: '#b8bcc4', metalness: 1, roughness: 0.35 }); // steel
new MeshPhysicalMaterial({ color: '#1e3a8a', roughness: 0.5, clearcoat: 1 }); // car paint
```

A lit material in a scene with no lights and no environment draws black, the most common "my model is black" bug. A metal also needs an environment to reflect, or it looks almost black. Physical's extras, like `clearcoat` and `transmission`, add almost nothing while they're 0, and add shader work once you turn them on.

### Stylized and debug looks: Toon, Matcap, and Normal

```js
new MeshToonMaterial({ color: '#22c55e', gradientMap: threeTones }); // NearestFilter on the gradient
new MeshMatcapMaterial({ matcap: clayBall });
part.material = new MeshNormalMaterial();
```

Toon's gradient texture needs `NearestFilter`, or its bands blur together. A matcap's shading is painted into its picture, so moving the lights changes nothing. `MeshNormalMaterial` colors each pixel by the way the surface faces, measured from the camera, so its colors shift as you orbit; the debug views page puts it to work.

### Swapping one for another

`mesh.material = other` works at any time, but each material type is its own shader program, built the first time it's drawn, which can cause a stutter. The decode, upload, compile page covers warming them up.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
