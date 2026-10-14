// A wax candle for the page's last scene, and three ways to draw wax: MeshPhysicalMaterial as it is,
// transmission (light through a clear body, then blurred), and a back-light glow added to the
// physical shader: an approximation of light scattering through a thin edge, which three.js's
// materials don't do.
import { onLeave } from '@harness/teardown';
import * as THREE from 'three';
import type { Bench } from '../bench';

export type Wax = 'plain' | 'transmission' | 'glow';

const WAX_COLOR = 0xf1e3c4; // ivory paraffin, picked by eye

// A pillar candle 7 cm across and 10 cm tall, its top melted into a shallow cup, with a wick.
function candleGeometry() {
  const r = 0.035;
  const points = [
    new THREE.Vector2(0, 0),
    new THREE.Vector2(r - 0.002, 0),
    new THREE.Vector2(r, 0.002),
    new THREE.Vector2(r, 0.096),
    new THREE.Vector2(r - 0.0015, 0.1), // the rim, rounded where it softened
    new THREE.Vector2(r - 0.004, 0.0995),
    new THREE.Vector2(r - 0.012, 0.094), // the cup
    new THREE.Vector2(0.008, 0.091),
    new THREE.Vector2(0, 0.0905),
  ];
  return new THREE.LatheGeometry(points, 96);
}

// The glow: where the key light is behind the wax, some of it comes through toward the camera,
// most at the thin edges and where the view looks toward the light. One term added to the diffuse
// light for each DirectionalLight.
function addGlow(material: THREE.MeshPhysicalMaterial) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <lights_fragment_end>',
      /* glsl */ `#include <lights_fragment_end>
      #if NUM_DIR_LIGHTS > 0
        for (int i = 0; i < NUM_DIR_LIGHTS; i++) {
          vec3 through = normalize(directionalLights[i].direction + normal * 0.3); // bent a little by the surface
          float facing = pow(saturate(dot(geometryViewDir, -through)), 3.0);    // looking toward the light
          float thin = 0.15 + 0.85 * pow(1.0 - saturate(dot(normal, geometryViewDir)), 2.0); // light gets through near the edges
          reflectedLight.directDiffuse += directionalLights[i].color * diffuseColor.rgb * facing * thin * 1.5;
        }
      #endif`,
    );
  };
  material.customProgramCacheKey = () => 'tactile-wax-glow';
}

export function addCandle(bench: Bench) {
  const geometry = candleGeometry();
  const materials: Record<Wax, THREE.MeshPhysicalMaterial> = {
    plain: new THREE.MeshPhysicalMaterial({ color: WAX_COLOR, roughness: 0.45 }),
    transmission: new THREE.MeshPhysicalMaterial({
      color: WAX_COLOR,
      roughness: 0.45,
      transmission: 1,
      thickness: 0.07, // the candle's width, in meters
      attenuationColor: new THREE.Color(0xf0c890),
      attenuationDistance: 0.05,
    }),
    glow: new THREE.MeshPhysicalMaterial({ color: WAX_COLOR, roughness: 0.45 }),
  };
  addGlow(materials.glow);
  const candle = new THREE.Mesh<THREE.BufferGeometry, THREE.Material>(geometry, materials.plain);
  candle.position.set(0, 0, -0.03);
  candle.castShadow = candle.receiveShadow = true;
  const wick = new THREE.Mesh(new THREE.CylinderGeometry(0.0009, 0.0009, 0.012, 8), new THREE.MeshStandardMaterial({ color: 0x1b1714, roughness: 0.9 }));
  wick.position.y = 0.0965;
  candle.add(wick);
  const { scene, container } = bench.harness;
  for (const mesh of [bench.swatch, bench.roll, bench.plank, bench.block]) scene.remove(mesh);
  scene.add(candle);
  onLeave(container, () => {
    geometry.dispose();
    wick.geometry.dispose();
    (wick.material as THREE.Material).dispose();
    for (const material of Object.values(materials)) material.dispose();
  });
  return (which: Wax) => {
    candle.material = materials[which];
  };
}
