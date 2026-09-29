---
id: 1.queries.ray-sphere.read-the-code.1
loop: 1
tier: light
concepts: [queries.ray-sphere]
mode: read-the-code
context: queries.ray-sphere/hotspot
lenses: []
misconceptions:
  - queries.ray-sphere/inside-misses
---

# Ray–sphere

> **In short:** `ray.intersectSphere(sphere, target)` finds where a ray first touches a ball, even when the ray starts inside it, and `ray.intersectsSphere(sphere)` just says whether it touches it at all.
>
> **Used for:** Clickable info dots on a product, skipping objects a ray can't come near before testing their triangles, rough hit tests for round things like planets and balloons, and checking whether a laser passes through a sensor's range.

## A · The basics

### A ball is the cheapest thing to test

A `Sphere` is a center and a radius. Testing a ray against it is a handful of multiplications, whatever is inside the ball, which is why three.js checks every mesh's bounding sphere before its triangles (the bounding box and sphere page). You can ask two things:

- **`ray.intersectsSphere(sphere)`**: does it touch? `true` or `false`.
- **`ray.intersectSphere(sphere, spot)`**: where? It writes the spot into `spot` and returns it, or returns `null`.

### Starting inside

A ray that starts inside the ball still touches it: on the way out. `intersectSphere` gives the nearest spot in front of the start, so from inside that's the exit, and from outside it's the entry. A ball entirely behind the start gives `null`.

**Analogy: a flashlight in a tent.** Shine it from outside and the beam lands on the near wall. Switch it on inside and it still lands on the tent, on the far wall. Walk past the tent and point away, and it lands on nothing.

Move the start of the ray through the ball.

<div data-scene="startInside"></div>

## B · Working knowledge

### Hotspots

Info dots on a product don't need meshes to be clickable. Give each one an invisible ball, a bit bigger than the dot, so it's easy to hit on a phone:

```js
const hotspot = new Sphere(dot.getWorldPosition(new Vector3()), 0.3);
raycaster.setFromCamera(pointer, camera);
if (raycaster.ray.intersectsSphere(hotspot)) showInfo(dot);
```

`intersectsSphere` is enough when you only need yes or no. It doesn't know what's in front, though: a hotspot behind the product still says yes. Compare distances, or raycast the product too, when that matters.

### Bounding spheres, in the world

A geometry's `boundingSphere` is measured from the object itself, around where the shape would be at the center of the scene. Move it into the world before testing it against a world ray:

```js
mesh.geometry.computeBoundingSphere(); // null until something computes it
const ball = mesh.geometry.boundingSphere.clone().applyMatrix4(mesh.matrixWorld);
const maybe = raycaster.ray.intersectsSphere(ball); // false: the mesh can't be hit
```

That's the first step three.js takes for each mesh in a raycast. A yes only means "maybe": the ray can pass through the ball and miss the shape inside, like the corner of a box. The triangle test on the ray–triangle page has the final say.

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
