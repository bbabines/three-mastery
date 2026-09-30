// Read-the-code questions for the world size per pixel page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const pin = new Mesh(new SphereGeometry(0.1), pinMaterial); // a fixed size
pin.position.copy(spot); // 5 units in front of the camera
// The camera backs away until the pin is 20 units in front of it.`,
    ask: 'How big does the pin look now?',
    choices: ['Just as big as before', 'A quarter as big', 'Half as big'],
    answer: 1,
    why: 'At four times the depth, a pixel covers four times as much of the world, so the pin looks a quarter as big. Scale it by `worldPerPixel` to keep its size.',
  },
  {
    code: `const d = camera.position.distanceTo(hotspot.position);
const worldPerPixel = camera.getViewSize(d, size).y / canvas.clientHeight;
hotspot.scale.setScalar(24 * worldPerPixel);`,
    ask: "How big are hotspots near the view's edges?",
    choices: ['Exactly 24 CSS pixels', 'Smaller than 24 CSS pixels', 'Bigger than 24 CSS pixels'],
    answer: 2,
    why: "`getViewSize` wants view depth. Off to the side, the straight-line distance is longer than the depth, so edge hotspots come out too big. Use the depth from the view matrix.",
  },
  {
    code: `renderer.setPixelRatio(2);
const worldPerPixel = camera.getViewSize(depth, size).y / renderer.domElement.height;
marker.scale.setScalar(24 * worldPerPixel); // meant to match a 24px CSS icon`,
    ask: 'How big is the marker next to the icon?',
    choices: ["Half the icon's height", 'The same height as the icon', "Twice the icon's height"],
    answer: 0,
    why: '`domElement.height` counts device pixels, twice the CSS pixels at a pixel ratio of 2, so the marker comes out half as big. Divide by `clientHeight` instead.',
  },
];
