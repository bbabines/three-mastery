// Loads Brad's models from /assets/models for lesson scenes. They're Draco-compressed, so the
// loader gets a Draco decoder. The decoder files come straight from the installed three package,
// which the dev server serves as-is.
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';

export const MODELS = {
  // A rack assembly: uprights, crossmembers, a safety, hardware, and many "(slot)" and "(anchor)"
  // marker nodes. Blender names repeat (".001", ".002"), so GLTFLoader renames them.
  rackParts: '/assets/models/rack-parts.glb',
  // Rack J-cups: small hardware parts.
  jcups: '/assets/models/jcups.glb',
};

export const DRACO_DECODER_PATH = '/node_modules/three/examples/jsm/libs/draco/';

let loader: GLTFLoader | undefined;

// One shared loader, so the Draco decoder's worker starts once per page.
export function gltfLoader() {
  if (!loader) {
    loader = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(DRACO_DECODER_PATH));
  }
  return loader;
}

export function loadModel(url: string): Promise<GLTF> {
  return gltfLoader().loadAsync(url);
}
