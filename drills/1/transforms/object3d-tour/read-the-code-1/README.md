---
id: 1.transforms.object3d-tour.read-the-code.1
loop: 1
tier: light
concepts: [transforms.object3d-tour]
mode: read-the-code
context: transforms.object3d-tour/place-product
lenses: []
misconceptions:
  - transforms.object3d-tour/position-assign
  - transforms.object3d-tour/rotation-quaternion-separate
---

# Tour: the Object3D API

> **In short:** Everything you put in a three.js scene, including meshes, lights, cameras, and groups, is an Object3D, so they all share one set of properties and methods for placing, attaching, hiding, and tagging them.
>
> **Used for:** Setting a product on a turntable and turning it; building a rack from parts that move together; hiding a shelf when a shopper removes it in a configurator; and storing a part's SKU so a click can look it up.

## A · The basics

### One toolkit for everything in the scene

`Mesh`, `Group`, `PerspectiveCamera`, `DirectionalLight`, and `Sprite` look like very different things, but they're all built on the same base class, **Object3D**. So a light moves with `position` exactly like a mesh does, and a camera can be added to a group like any part. Learn this toolkit once and it works on everything.

**Analogy: a warehouse tag.** Every item in a warehouse gets the same tag, whatever the item is: where it sits, which way it faces, which box it's packed in, whether it's on display, and a notes field. Object3D is that tag.

### The members, at a glance

| Member | What it does | Reach for it when | Cost |
| --- | --- | --- | --- |
| `position`, `rotation`, `scale` | Where it sits, which way it's turned, and how big it is, measured from its parent | Placing anything | Free to set; three.js rebuilds its matrix when it renders |
| `quaternion` | The same turn as `rotation`, stored another way | Smooth turns and combining turns | Free |
| `add`, `remove` | Attach a child, or detach it | Building something from parts | Free |
| `attach` | Attach a child without it moving in the world | Picking something up | A little CPU math per call |
| `getWorldPosition` and friends | Where it really is, and how it's really turned, in the world | Measuring, or aiming at a part | A little CPU math per call |
| `lookAt` | Turn it to face a spot in the world | Aiming a camera, a sign, or a turret | A little CPU math per call |
| `visible` | Hide it, along with everything attached to it | Toggling parts | Saves work: hidden objects aren't drawn |
| `layers` | Show it to some cameras and not others | A part only one view should see | Free |
| `userData` | A plain object for your own data | Tagging a part with an ID or SKU | Free |

This page only maps them out. Each one that needs a deeper look has its own page later, such as the local vs world space page, the add vs attach page, and the pages in the rotation domain.

Try each member on the rack. The readout shows the line that ran and what it changed. Try **rotation** and then **quaternion**: each one changes the other too.

<div data-scene="members"></div>

## B · Working knowledge

### Placing and turning

```js
rack.position.set(2, 0, -1);
rack.position.copy(spot);        // copies the numbers; later changes to spot don't follow
rack.rotation.y = Math.PI / 2;   // radians: MathUtils.degToRad(90) if you think in degrees
rack.scale.setScalar(1.5);
```

- **You change these vectors, you don't replace them.** `position`, `rotation`, `quaternion`, and `scale` are read-only properties, so `rack.position = spot` throws a TypeError in a module, and in an old non-module script it quietly does nothing. Use `set` or `copy`.
- **Angles are in radians.** `rotation.y = 90` spins it around more than 14 times and lands somewhere odd.

### rotation and quaternion are one turn

```js
rack.rotation.y = Math.PI / 2;
console.log(rack.quaternion.y); // 0.707: already updated to the same turn
```

Setting either one updates the other straight away. They're two ways of storing one turn, not two turns that add up. `rotation` is easier to read; `quaternion` is better for combining and blending turns, which the quaternions page covers.

### Building from parts

```js
rack.add(shelf);      // the shelf now moves with the rack
rack.remove(shelf);   // detached, but it still exists and can be added again
floor.attach(shelf);  // a new parent, and the shelf stays where it was in the world
```

- An object has only one parent. Adding it somewhere new takes it off its old parent first.
- `remove` doesn't free anything on the GPU. The disposal ownership page covers what does.

### Asking where it is, and aiming it

```js
const spot = new Vector3();
shelf.getWorldPosition(spot);    // where the shelf really is, in the world
sign.lookAt(camera.position);    // turn to face the camera
```

`getWorldQuaternion`, `getWorldScale`, and `getWorldDirection` work the same way: pass in an object for the answer to be written into. `lookAt` turns a mesh so its +Z side faces the spot, and a camera so it looks at the spot.

### Hiding, filtering, and tagging

```js
shelf.visible = false;          // not drawn, and neither is anything attached to it
detail.layers.set(1);           // only cameras with layer 1 on will draw it
closeUpCamera.layers.enable(1);
shelf.userData.sku = 'R3-SHELF';
```

- Hiding a parent doesn't change its children's `visible`. They still say `true`; they just aren't drawn while the parent is hidden.
- Every object and camera starts on layer 0, which is why everything shows up by default.
- `userData` rides along with the object, including through `clone`. Models loaded from glTF can arrive with it already filled in.

### Which space is it in?

| Value | Space |
| --- | --- |
| `object.position`, `.rotation`, `.quaternion`, `.scale` | Measured from its parent |
| What `getWorldPosition(v)` and the other `getWorld…` methods give back | The world |
| The spot `lookAt(v)` turns toward | The world |

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
