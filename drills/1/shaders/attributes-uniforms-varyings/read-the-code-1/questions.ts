// Read-the-code questions for the attributes, uniforms, varyings page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `// vertex shader: the triangle's corners are red, green, and blue
vColor = color;
// fragment shader
gl_FragColor = vec4(vColor, 1.0);`,
    ask: 'What color is the fragment at the very center of the triangle?',
    choices: [
      'An even mix of red, green, and blue',
      "Red, the first corner's color, unchanged",
      'Black, since no vertex sits at the center',
    ],
    answer: 0,
    why: "A varying is blended across the triangle: each fragment gets a mix of the three corners' values, weighted by how close it is to each. At the center that's a third of each, (0.33, 0.33, 0.33), a gray. Only `flat varying` would hand one corner's value to the whole triangle.",
  },
  {
    code: `// vertex shader, on a box whose corners run from y = -1 to y = 1
vHeight = position.y;
// fragment shader
gl_FragColor = vec4(vec3(vHeight * 0.5 + 0.5), 1.0);`,
    ask: 'What does a side of the box look like?',
    choices: [
      'Black on the bottom half, white on the top half',
      'One flat gray, since each face gets one value',
      'A smooth fade, black at the bottom to white at the top',
    ],
    answer: 2,
    why: "The side's bottom corners hold −1 and its top corners 1, and every fragment in between gets a blend, so the value climbs smoothly up the side: 0 at the bottom edge, 0.5 halfway, 1 at the top. Blending is what turns values at a few corners into a gradient over the whole surface.",
  },
  {
    code: `flat varying vec3 vNormal; // in both shaders
// fragment shader
float light = max(dot(normalize(vNormal), uToSun), 0.0);`,
    ask: 'How does a smooth ball look with this lighting?',
    choices: [
      'Smooth: the normal is blended as usual',
      'Faceted: each triangle gets one flat shade all over',
      "Black: flat varyings can't hold a direction",
    ],
    answer: 1,
    why: "`flat` turns blending off, so all of a triangle's fragments get one corner's normal, unchanged. Each triangle is lit as one flat shade, and the ball looks cut from facets. Without `flat`, the normal is blended across each triangle and the ball shades smoothly.",
  },
  {
    code: `let time = 0;
const material = new ShaderMaterial({ uniforms: { uTime: { value: time } }, vertexShader, fragmentShader });
renderer.setAnimationLoop((now) => {
  time = now / 1000;
  renderer.render(scene, camera);
});`,
    ask: 'The effect never moves. Why?',
    choices: [
      'Uniforms are fixed once the material is compiled',
      'time must be in milliseconds, not seconds',
      'The uniform copied the number 0 and never changes',
    ],
    answer: 2,
    why: "`{ value: time }` copied the number `time` held when the material was made, 0, and changing the variable afterwards doesn't touch it. Set the material's own uniform instead: `material.uniforms.uTime.value = now / 1000;`. Uniforms can change every frame; three.js uploads the new value before each draw.",
  },
  {
    code: `// vCorner is (1, 0, 0), (0, 1, 0), (0, 0, 1) at each triangle's three corners
float nearEdge = min(min(vCorner.x, vCorner.y), vCorner.z);
gl_FragColor = vec4(vec3(nearEdge < 0.03 ? 0.0 : 1.0), 1.0);`,
    ask: 'What shows on the model?',
    choices: [
      "Black lines along every triangle's edges",
      "Black dots at every triangle's corners",
      'All white, since the values are never that small',
    ],
    answer: 0,
    why: "Along an edge, a fragment is a blend of only the two corners at that edge's ends, so the third corner's share is 0. The smallest of the three values is near 0 on every edge and bigger inside, and `nearEdge < 0.03` turns that thin strip black: every triangle gets an outline. The corners need their own vertices, on a non-indexed geometry, so neighboring triangles don't share them.",
  },
];
