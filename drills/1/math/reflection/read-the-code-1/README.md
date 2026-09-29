---
id: 1.math.reflection.read-the-code.1
loop: 1
tier: light
concepts: [math.reflection]
mode: read-the-code
context: math.reflection/bounce
lenses: []
misconceptions:
  - math.reflection/n-unnormalized
---

# Reflection

> **In short:** Turns an incoming direction into the direction it bounces off a surface.
>
> **Used for:** Bouncing balls and projectiles, mirrors, and shiny materials that reflect their surroundings.

## A · The basics

### Bouncing off a surface

When a ball hits a wall, it bounces off at the same angle it came in, mirrored. **Reflection** gives you that bounce direction from two things: the incoming direction and the surface's **normal**, the direction the surface faces.

```js
const bounce = velocity.clone().reflect(normal);
```

**Analogy: a pool ball off the cushion.** It comes in at an angle and leaves at the same angle on the other side. A mirror does the same thing with light.

Change the angle, then try the second button:

<div data-scene="bounce"></div>

## B · Working knowledge

### The normal must have length 1

`reflect` assumes the normal has length 1. With a longer normal, the bounce comes out wrong: in the scene, a normal of length 2 sends the ball up with seven times the upward speed it should have. From a raycast, `hit.face.normal` has length 1, but the smoothed `hit.normal` doesn't, so normalize it. Normals you build yourself, from a cross product for example, need `.normalize()` too.

Both raycast normals are measured in the object's own space, not the world. Once the mesh is turned, reflecting a world velocity off them bounces the wrong way. `normal.clone().transformDirection(mesh.matrixWorld)` turns one into world space and also sets its length to 1. (For a stretched mesh, the exact fix is the normal matrix, which has its own page in the transforms domain.)

### Bounces that lose energy

Real bounces lose some speed. Reflect, then scale down:

```js
velocity.reflect(normal).multiplyScalar(0.8);
```

### Shiny surfaces in shaders

Shaders use reflection to decide what a shiny surface shows. Reflect the direction from the camera to the surface, then look up that direction in an environment map, like a chrome ball showing the room around it:

```glsl
vec3 mirrored = reflect(-toCamera, normal);
vec3 shine = texture(envMap, mirrored).rgb;
```

## Drill · Read the code

Pick an answer for each snippet. You'll see right away whether it's right and why.

<div data-quiz></div>
