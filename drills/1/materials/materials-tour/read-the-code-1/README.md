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

> **In short:** A material decides how a mesh's surface looks, and three.js's built-in materials range from flat color that ignores lights to physically based surfaces that react to every light and reflection in the scene.
>
> **Used for:** Price tags and labels that must show their exact color; a brushed-steel or powder-coated product finish that looks real; a quick look at a model's normals or depth when something renders wrong; and a stylized, cartoon look for a game or an explainer.

## A · The basics

### A mesh is a shape plus a look

The object types tour showed that a `Mesh` takes a geometry and a material. The geometry is the shape. The **material** is the look: its color, whether it's matte or shiny, and above all whether it reacts to the lights in the scene. A material that reacts to lights is called **lit**; one that ignores them is **unlit**.

Every material type is its own small program that runs on the GPU for every pixel the mesh covers, called a **shader**. Lit materials work out, for every pixel and every light, how much light reaches that spot, so they cost more the more lights there are.

**Analogy: finishes on a product sample.** A printed sticker looks the same under any lamp. Matte paint shows where the lamp is, glossy paint adds a bright spot, and polished metal mirrors the whole room. A sticker is an unlit material; the paints and the metal are lit ones.

### The members, at a glance

| Material | What it is | Reach for it when | Cost |
| --- | --- | --- | --- |
| `MeshBasicMaterial` | Flat color or a picture; ignores lights | Labels, UI, anything that must show its exact color | The least of all |
| `MeshLambertMaterial` | Matte: light spreads evenly, with no shine | Paper, plaster, matte parts on low-end phones | Low: a little GPU work per pixel, per light |
| `MeshPhongMaterial` | Matte plus a shiny highlight | Glossy plastic or paint, when Standard costs too much | A little more than Lambert |
| `MeshStandardMaterial` | Physically based: set by `metalness` and `roughness` | Most real products; what glTF models load with | More per pixel; the usual choice |
| `MeshPhysicalMaterial` | Standard plus clearcoat, sheen, transmission, and more | Car paint, fabric, glass | Standard's cost plus each extra you turn on |
| `MeshToonMaterial` | Light in flat bands, like a cartoon | A stylized look | Low |
| `MeshMatcapMaterial` | Shading taken from a small picture of a lit ball; ignores lights | A fixed, sculpting-app look | Very low: one texture read per pixel |
| `MeshNormalMaterial` | Colors from the way each surface faces; ignores lights | Checking normals | Very low |
| `MeshDepthMaterial` | Gray by distance from the camera; ignores lights | Checking depth; three.js draws shadows with it | Very low |

This page only maps them out. The diffuse, specular, and PBR metal and roughness pages, later in this domain, open up what Lambert, Phong, and Standard do, and the environment maps page covers reflections.

Try each material on the same part, then move the light. The readout shows the line that set it and whether it reacts to lights.

<div data-scene="members"></div>

## B · Working knowledge

### Unlit: MeshBasicMaterial

```js
const tag = new Mesh(plane, new MeshBasicMaterial({ map: priceTexture }));
```

It shows its color or its `map` exactly, whatever the lights do, which is what a label or a UI panel wants. It has no shading at all, so a 3D shape made with it looks flat. It isn't ignored by everything: tone mapping still changes its color unless you set `toneMapped: false` (the tone mapping page).

### Lit and cheap: Lambert and Phong

```js
new MeshLambertMaterial({ color: '#9aa0ab' });
new MeshPhongMaterial({ color: '#f97316', shininess: 60 }); // shininess: how tight the highlight is
```

A lit material in a scene with no lights and no environment draws black. That's the most common "my model is black" bug with a new scene.

### Physically based: Standard and Physical

```js
const steel = new MeshStandardMaterial({ color: '#b8bcc4', metalness: 1, roughness: 0.35 });
const paint = new MeshPhysicalMaterial({ color: '#1e3a8a', roughness: 0.5, clearcoat: 1 });
```

- `GLTFLoader` gives most models a `MeshStandardMaterial`, and a `MeshPhysicalMaterial` when the file uses one of its extras.
- A metal with no environment to reflect looks almost black. The environment maps page covers `scene.environment`.
- Physical's extras (`clearcoat`, `sheen`, `transmission`, and others) add almost nothing while they're 0, their default: three.js leaves them out of the shader. Each one you turn on adds shader work, and `transmission` adds a whole extra render of the scene's solid objects.

### Stylized: Toon and Matcap

```js
new MeshToonMaterial({ color: '#22c55e', gradientMap: threeTones }); // NearestFilter on the gradient
new MeshMatcapMaterial({ matcap: clayBall });
```

Toon splits the light into bands; with no `gradientMap` it uses two. Its gradient texture needs `minFilter` and `magFilter` set to `NearestFilter`, or the bands blur together. A matcap's shading is painted into its picture, so moving the lights changes nothing.

### Debug views: Normal and Depth

```js
part.material = new MeshNormalMaterial();
```

`MeshNormalMaterial` colors each pixel by the way the surface faces, measured from the camera, so the colors shift as you orbit. `MeshDepthMaterial` shades by distance between the camera's near and far planes. The debug views page, in the debugging domain, uses them properly.

### Swapping one for another

`mesh.material = other` works at any time, but each material type is its own shader program, built the first time it's drawn, which can cause a stutter. The decode, upload, compile page covers warming them up. One material can be shared by many meshes; changing its color changes all of them.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
