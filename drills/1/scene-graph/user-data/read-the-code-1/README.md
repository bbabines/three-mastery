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

> **In short:** A spot on every object for your own data, like a part number or a "can be clicked" flag, that goes wherever the object goes.
>
> **Used for:** Part numbers and prices, marking what a click may select, saving an original material, and data typed in Blender.

## A · The basics

### A notes field on every object

Every Object3D has `userData`, a plain JavaScript object that starts empty. three.js never uses what's in it; it's yours.

```js
part.userData.sku = 'SAF-FD-4';
part.userData.selectable = true;
```

Data kept on the object travels with it. When a click lands on a part, its data is right there, however the part is named. A separate table keyed by name breaks as soon as two parts share a name, which happens as soon as a model is loaded twice.

**Analogy: a tag tied to the item.** A price tag tied to a lamp goes wherever the lamp goes. A price list at the till has to be looked up by name, and gets it wrong when two lamps share one.

### Data from the file

A glTF file can give any node or material `extras`: free-form data from the tool that made it. GLTFLoader copies a node's extras into its object's `userData`, and a material's into `material.userData`. In Blender, custom properties become extras when the exporter's Include › Custom Properties option is on.

The rack model has no extras, so the only thing in its `userData` is `name`, the Blender name. Here each part gets a SKU in code instead. Pick where a click lands. The part it belongs to gets a yellow box if a click may select it, or a gray one if not.

<div data-scene="tags"></div>

## B · Working knowledge

### Tagging parts after loading

```js
model.traverse((object) => {
  const sku = skus[object.userData.name]; // skus: { '(export) front stabilizer': 'STB-FRONT', … }
  if (sku) object.userData.sku = sku;
});
```

Keyed by the Blender name in `userData.name`, the tags don't depend on how GLTFLoader cleans names, and every copy of the model gets the same ones.

### From a click to the part's data

```js
let part = hit.object;
while (part && part.userData.sku === undefined) part = part.parent;
if (part?.userData.selectable) select(part);
```

The walk up stops at the first object that carries data.

### What survives a clone or a save

`clone()`, `toJSON()`, and GLTFExporter all copy `userData` by turning it into JSON text and back. Plain data comes through, and the copy gets its own. Functions are dropped, and a material comes back as a plain description, not the material itself. So keep live objects, like a mesh's original material, in a `Map` instead, as the material override page does.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
