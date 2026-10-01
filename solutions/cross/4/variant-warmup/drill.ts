import type { Answer } from '@harness/drill';
import { Camera, Material, Mesh, Scene, WebGLRenderer } from 'three';

export function warmVariants(renderer: WebGLRenderer, scene: Scene, camera: Camera, mesh: Mesh, variants: Material[]): Answer<number> {
  const original = mesh.material;
  try {
    for (const material of variants) {
      mesh.material = material;
      renderer.render(scene, camera);
    }
    return variants.length;
  } finally {
    mesh.material = original;
  }
}
