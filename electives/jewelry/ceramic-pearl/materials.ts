// Ceramic and pearl the way iJewel's playground sets them up: a color, a roughness, and nothing
// else. None of these has a texture map. The look comes from what the surface reflects, so the
// scene needs an environment (scene.environment) for any of them to look right. The capstone unit
// builds Spring from these.
import * as THREE from 'three';

// iJewel's two ceramics (assets/reference/ijewel/materials), as the .pmat files store them: sRGB
// hex. three.js turns a hex color into the same linear numbers Spring.glb stores.
export const CERAMICS = {
  rosa: 0xcf7c7c, // ceramic_rosa: Spring's pink flowers ("Ceramic")
  red: 0x8d2727, // ceramic_red_2: Spring's red inner band (named "Metal 03" in the file)
};

// Glazed ceramic: a colored body (metalness 0) under a sharp, clear reflection (roughness 0).
// Double-sided, as in the file, so thin petals show from behind too.
export function ceramicMaterial(color: THREE.ColorRepresentation = CERAMICS.rosa) {
  return new THREE.MeshStandardMaterial({ color, metalness: 0, roughness: 0, side: THREE.DoubleSide });
}

// The other way to glaze: a softer body (`baseRoughness`) under a second, clear layer whose own
// roughness is 0. Only MeshPhysicalMaterial has clearcoat.
export function glazedMaterial(color: THREE.ColorRepresentation = CERAMICS.rosa, baseRoughness = 0.6) {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0,
    roughness: baseRoughness, // the body: a soft, blurred sheen
    clearcoat: 1, // the glaze on top, at full strength
    clearcoatRoughness: 0, // and mirror-smooth, so it shows the room sharply
    side: THREE.DoubleSide,
  });
}

// iJewel's pearl_rose_2, as stored: mostly metal (all reflection, tinted by the color), slightly blurred.
export const PEARL = { color: 0xba7547, metalness: 0.967, roughness: 0.25 };

// The pearl, plus a thin film for the color shift. iJewel draws its film with its own layer, whose
// numbers it doesn't document; this is three.js's built-in version, which needs MeshPhysicalMaterial.
export function pearlMaterial(iridescence = 0.6) {
  return new THREE.MeshPhysicalMaterial({
    ...PEARL,
    side: THREE.DoubleSide,
    iridescence, // how strong the film's color shift is, 0 to 1
    iridescenceIOR: 1.3, // how strongly the film bends light (the default)
    iridescenceThicknessRange: [100, 400], // film thickness in nanometers; with no thickness map, only 400 is used
  });
}
