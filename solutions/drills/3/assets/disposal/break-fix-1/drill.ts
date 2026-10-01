import { BufferGeometry, Material, Mesh, MeshStandardMaterial, Object3D, Texture } from 'three';

export function retireProduct(root: Object3D): void {
  const geometries = new Set<BufferGeometry>();
  const materials = new Set<Material>();
  const textures = new Set<Texture>();
  root.traverse((object) => {
    if (!(object instanceof Mesh)) return;
    geometries.add(object.geometry);
    for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
      materials.add(material);
      if (material instanceof MeshStandardMaterial) {
        if (material.map) textures.add(material.map);
        if (material.normalMap) textures.add(material.normalMap);
      }
    }
  });
  root.removeFromParent();
  for (const geometry of geometries) geometry.dispose();
  for (const material of materials) material.dispose();
  for (const texture of textures) texture.dispose();
}
