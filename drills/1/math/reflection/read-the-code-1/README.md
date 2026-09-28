---
id: 1.math.reflection.read-the-code.1
loop: 1
tier: light
concepts: [math.reflection]
mode: read-the-code
context: math.reflection/bounce
minutes: 8
lenses: []
misconceptions:
  - math.reflection/n-unnormalized
---

# Reflection

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

`reflect` assumes the normal has length 1. With a longer normal, the bounce comes out wrong: in the scene, a normal of length 2 sends the ball up seven times too fast. Normals from three.js, such as raycast hit normals, are already length 1; normals you build yourself, from a cross product for example, need `.normalize()`.

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
