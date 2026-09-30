// Read-the-code questions for the vertex normals page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const faceted = sphereGeometry.toNonIndexed();
faceted.computeVertexNormals();
const ball = new Mesh(faceted, new MeshStandardMaterial());`,
    ask: 'How does the ball light?',
    choices: [
      'Smooth: the normals average across faces',
      'Black: a non-indexed mesh has no normals',
      'Faceted: each triangle is lit evenly',
    ],
    answer: 2,
    why: "Without an index, every vertex belongs to one triangle, so its average is just that triangle's face normal. Each triangle's corners share one normal, and the ball looks faceted.",
  },
  {
    code: `// vertex 0 is shared by a big triangle facing up and a tiny one facing sideways
geometry.computeVertexNormals();
const n = new Vector3().fromBufferAttribute(geometry.attributes.normal, 0);`,
    ask: 'Which way does `n` point?',
    choices: [
      'Halfway between up and sideways',
      'Almost straight up, since big faces count more',
      'Sideways, since the last face listed wins',
    ],
    answer: 1,
    why: "`computeVertexNormals` adds up the faces around each vertex, with bigger triangles counting more. A tiny triangle barely moves the result, so `n` is nearly the big face's normal.",
  },
  {
    code: `const gltf = await loader.loadAsync('bracket.glb');
gltf.scene.traverse((o) => { if (o.isMesh) helpers.add(new VertexNormalsHelper(o, 0.05)); });
// dark patches on one side; some helper lines point into the bracket`,
    ask: 'What is most likely wrong?',
    choices: [
      'The file came with some normals flipped',
      'GLTFLoader reads every normal backward',
      'Nothing, since lighting skips stored normals',
    ],
    answer: 0,
    why: 'Normals in a file are whatever the exporting tool wrote, and flipped ones light dark. If the corner order is right, `computeVertexNormals()` rebuilds them; otherwise fix the export.',
  },
  {
    code: `const creased = toCreasedNormals(geometry, MathUtils.degToRad(30));`,
    ask: 'Which edges stay sharp?',
    choices: [
      'Edges where the faces meet at under 30°',
      'Every edge, since it flattens the mesh',
      'Edges where the faces meet at over 30°',
    ],
    answer: 2,
    why: '`toCreasedNormals` smooths everywhere except across edges whose faces meet at more than the angle you pass. It returns a geometry with no index, so it uses more memory.',
  },
  {
    code: `// this glTF mesh has no normal attribute
const panel = gltf.scene.getObjectByName('Panel');
console.log(panel.material.flatShading);`,
    ask: 'What does it log?',
    choices: ['`true`', '`false`', '`undefined`'],
    answer: 0,
    why: "A glTF mesh with no normals is meant to look flat, so `GLTFLoader` turns `flatShading` on, and the shader works out each triangle's face normal as it draws.",
  },
];
