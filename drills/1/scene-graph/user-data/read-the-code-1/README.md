---
id: 1.scene-graph.user-data.read-the-code.1
loop: 1
tier: light
concepts: [scene-graph.user-data]
mode: read-the-code
context: scene-graph.user-data/tag-ids
lenses: []
misconceptions:
  - scene-graph.user-data/outside-scene
---

# userData and metadata

> **In short:** Every object has `userData`, a plain object for your own data, so a part can carry its SKU, its price, or a "selectable" flag around with it, and a glTF file can fill it in before your code runs.
>
> **Used for:** Looking up a part's SKU and price when a shopper clicks it; marking which parts a click is allowed to pick; keeping a mesh's original material so a highlight can be undone; and carrying data an artist typed into Blender through to the app.

## A · The basics

### A notes field on every object

The Object3D API tour named `userData`: a plain JavaScript object on every Object3D, empty until something fills it. three.js never uses what's in it; it's yours.

```js
part.userData.sku = 'SAF-FD-4';
part.userData.selectable = true;
```

Data kept on the object travels with it. When a click lands on a part, its data is right there, however the part is named and however many copies there are. A separate table keyed by name breaks as soon as two parts share a name, which, as the finding objects page showed, happens as soon as a model is loaded twice.

**Analogy: a tag tied to the item.** A price tag tied to a lamp goes wherever the lamp goes. A price list at the till has to be looked up by name, and gets it wrong when two lamps share one.

### Data from the file

A glTF file can give any node, mesh, or material `extras`: free-form data from the tool that made it. GLTFLoader copies a node's extras into its object's `userData`, and a material's into `material.userData`. In Blender, custom properties become extras when the exporter's Include › Custom Properties option is on.

Brad's models don't have any extras yet, so the only thing GLTFLoader put in their `userData` is `name`, the node's name before cleaning. Here, each part gets a SKU in code instead. Pick where a click lands. The code walks up from that Mesh, boxed in green, to the first object with a SKU: yellow if a click may select it, gray if its `userData` says it can't.

<div data-scene="tags"></div>

## B · Working knowledge

### Tagging parts after loading

```js
const skus = {
  '(export) flipdown safety 4': 'SAF-FD-4',
  '(export) front stabilizer': 'STB-FRONT',
};
model.traverse((object) => {
  const sku = skus[object.userData.name];
  if (sku) object.userData.sku = sku;
});
```

Keyed by the original name in `userData.name`, so GLTFLoader's cleaning doesn't matter, and every copy of the model can be tagged the same way.

### From a click to the part's data

```js
let part = hit.object;
while (part && part.userData.sku === undefined) part = part.parent;
if (part?.userData.selectable) select(part);
```

The same walk as the traverse variants page, stopping at the first object that carries data.

### What survives a clone or a save

`clone()`, `toJSON()`, and GLTFExporter (which writes it back out as extras) all copy `userData` by turning it into JSON text and back. So:

- Plain data (strings, numbers, true and false, arrays, and plain objects) comes through, and the copy gets its own: changing one doesn't change the other.
- Functions are dropped.
- A material comes back as a plain description of the material, not the material itself. A reference to another object in the tree can make `clone()` throw a TypeError.

Keeping a mesh's original material in `userData.originalMaterial` works as long as the mesh isn't cloned or saved in between. The material override page keeps them in a `Map` instead.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
