// Read-the-code questions for the world size per pixel page. The drill viewer grades each one on click.
import type { Question } from '@harness/quiz';

export const questions: Question[] = [
  {
    code: `const pin = new Mesh(new SphereGeometry(0.1), pinMaterial); // a fixed size
pin.position.copy(spot); // 5 units in front of the camera
// The camera backs away until the pin is 20 units in front of it.`,
    ask: 'How big does the pin look now?',
    choices: ['The same size as before', 'A quarter of its size before', 'Half its size before'],
    answer: 1,
    why: "A pixel covers four times as much of the world at four times the depth, so a pin of fixed size covers a quarter as many pixels. To keep it the same size on screen, scale it with its depth: `24 * worldPerPixel` for 24 pixels.",
  },
  {
    code: `const d = camera.position.distanceTo(hotspot.position);
const worldPerPixel = camera.getViewSize(d, size).y / canvas.clientHeight;
hotspot.scale.setScalar(24 * worldPerPixel);`,
    ask: 'How big do hotspots near the edges of a wide view come out?',
    choices: ['Exactly 24 pixels', 'Smaller than 24 pixels', 'Bigger than 24 pixels'],
    answer: 2,
    why: "`getViewSize` wants the depth straight along the way the camera faces. A hotspot off to the side is farther away in a straight line than its depth, so the size comes out too big: about 28 pixels at the edge of a view twice as wide as it is tall. Use `-hotspot.position.clone().applyMatrix4(camera.matrixWorldInverse).z`.",
  },
  {
    code: `renderer.setPixelRatio(2);
const worldPerPixel = camera.getViewSize(depth, size).y / renderer.domElement.height;
marker.scale.setScalar(24 * worldPerPixel); // meant to match a 24px CSS icon`,
    ask: 'How big is the marker next to the icon?',
    choices: ["Half the icon's height", 'The same height as the icon', "Twice the icon's height"],
    answer: 0,
    why: "`domElement.height` counts device pixels, twice as many as CSS pixels at a pixel ratio of 2, so `worldPerPixel` comes out half as big and so does the marker: 24 device pixels is 12 CSS pixels. Divide by `renderer.domElement.clientHeight` to match CSS sizes.",
  },
];
