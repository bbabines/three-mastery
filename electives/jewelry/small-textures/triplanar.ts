// Triplanar mapping for a MeshStandardMaterial, in GLSL: the color map and roughness map are
// projected onto the part from three sides instead of being read at the mesh's UVs, so a small
// seamless tile covers any shape, UVs or not. Used by the small-textures page and the capstone.
//
// Object space, not world space: the projectors are measured from the object itself, so the
// texture stays stuck to the part when it moves or turns (a ring turning on a turntable, a part
// swapped in a configurator). In world space the grain would slide across a moving part. The cost
// of object space: a mesh whose own scale is uneven stretches the texture with it. Spring's wood
// band, Tube005, is scaled 1.43 along one axis, so either bake its transform into the geometry
// first (geometry.applyMatrix4) or accept wood grain stretched 1.43 times in that direction.
// iJewel's material file says triplanar is on (scale 1, blend 6) but not which space it uses or
// what its numbers mean; this code's own `scale` and `blend` are explained below.
import * as THREE from 'three';

export interface TriplanarOptions {
  map?: THREE.Texture | null; // a color map: marked sRGB
  roughnessMap?: THREE.Texture | null; // a data map: left at NoColorSpace (reads the green channel)
  // Tiles per unit, measured from the object itself. 1 = one tile per unit. Spring's Tube005, as
  // stored, is about 61 units across before its parents shrink it to about 2.2, so on the untouched
  // mesh 0.037 matches 1 here.
  scale?: number;
  // How sharply each projector takes over: the facing's strength is raised to this power. 1 blends
  // softly and smears at 45°; 30 or more shows hard seams. 6 matches iJewel's blendFactor number.
  blend?: number;
  color?: THREE.ColorRepresentation; // multiplies the color map, as for any MeshStandardMaterial
  roughness?: number; // multiplies the roughness map
  metalness?: number;
  side?: THREE.Side;
  debug?: boolean; // paint each projector's share as red (from the side, x), green (from above, y), blue (from the front, z)
}

// The uniforms a scene changes live, without a recompile: material.userData.triplanar.scale.value = 2.
export interface TriplanarUniforms {
  scale: { value: number };
  blend: { value: number };
}

const VERTEX_DECLARATIONS = /* glsl */ `
varying vec3 vTriplanarPosition;
varying vec3 vTriplanarNormal;
`;

// After morphing and skinning, before the move into the world: still measured from the object itself.
const VERTEX_PASS = /* glsl */ `
vTriplanarPosition = transformed;
vTriplanarNormal = objectNormal;
#include <project_vertex>
`;

const FRAGMENT_DECLARATIONS = /* glsl */ `
uniform float triplanarScale;
uniform float triplanarBlend;
varying vec3 vTriplanarPosition;
varying vec3 vTriplanarNormal;

// How much each projector counts here: the more the surface faces an axis, the more that axis's
// projector wins. abs() so the back of the part takes the same picture as the front.
vec3 triplanarWeights() {
  vec3 facing = pow( abs( normalize( vTriplanarNormal ) ), vec3( triplanarBlend ) );
  return facing / ( facing.x + facing.y + facing.z );
}

// Three reads of the same tile, one per projector, mixed by weight. The image's up direction (the
// grain, for the wood) runs along y on the side and front pictures and along x on the top one.
vec4 triplanarSample( sampler2D tile, vec3 weight ) {
  vec3 p = vTriplanarPosition * triplanarScale;
  return texture2D( tile, p.zy ) * weight.x  // seen from the side (+X)
       + texture2D( tile, p.zx ) * weight.y  // seen from above (+Y)
       + texture2D( tile, p.xy ) * weight.z; // seen from the front (+Z)
}
`;

// Replaces three.js's map_fragment chunk, which reads `map` once at vMapUv.
const MAP_FRAGMENT = /* glsl */ `
vec3 triplanarWeight = triplanarWeights();
#ifdef TRIPLANAR_DEBUG
  diffuseColor.rgb = triplanarWeight;
#elif defined( USE_MAP )
  diffuseColor *= triplanarSample( map, triplanarWeight );
#endif
`;

// Replaces roughnessmap_fragment, which reads `roughnessMap` once at vRoughnessMapUv and keeps green.
const ROUGHNESS_FRAGMENT = /* glsl */ `
float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
  roughnessFactor *= triplanarSample( roughnessMap, triplanarWeight ).g;
#endif
`;

// A MeshStandardMaterial whose map and roughnessMap are projected from three sides. The maps stay in
// material.map and material.roughnessMap, so three.js still uploads them, honors their color space
// and wrapping, and needs material.needsUpdate = true when one is added or removed. The texture's own
// repeat and offset are ignored; `scale` replaces them.
export function triplanarMaterial(options: TriplanarOptions = {}) {
  const { map = null, roughnessMap = null, scale = 1, blend = 6, debug = false } = options;
  const material = new THREE.MeshStandardMaterial({
    map,
    roughnessMap,
    color: options.color ?? 0xffffff,
    roughness: options.roughness ?? 1,
    metalness: options.metalness ?? 0,
    side: options.side ?? THREE.FrontSide,
  });
  const uniforms: TriplanarUniforms = { scale: { value: scale }, blend: { value: blend } };
  material.userData.triplanar = uniforms;

  material.onBeforeCompile = (shader) => {
    shader.uniforms.triplanarScale = uniforms.scale;
    shader.uniforms.triplanarBlend = uniforms.blend;
    if (debug) shader.defines = { ...shader.defines, TRIPLANAR_DEBUG: '' };
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>\n${VERTEX_DECLARATIONS}`)
      .replace('#include <project_vertex>', VERTEX_PASS);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>\n${FRAGMENT_DECLARATIONS}`)
      .replace('#include <map_fragment>', MAP_FRAGMENT)
      .replace('#include <roughnessmap_fragment>', ROUGHNESS_FRAGMENT);
  };
  // Every triplanar material shares one onBeforeCompile source, so the debug view needs its own key.
  material.customProgramCacheKey = () => `triplanar${debug ? '-debug' : ''}`;
  return material;
}

export const WOOD_TEXTURES = {
  color: '/assets/reference/ijewel/textures/wood_329bd7b8b5.jpg',
  roughness: '/assets/reference/ijewel/textures/wood_bump_5b98b6225c.jpg', // named "bump", used as roughness
};

// iJewel's wood material (materials/wood_brown_dc600520d8.pmat), apart from the two maps.
export const WOOD = { color: 0xca997d, roughness: 0.297, metalness: 0.144, scale: 1, blend: 6 };

// The wood's two maps, set up for tiling. New Texture objects on every call, so one scene can change
// a color space without touching another's; the browser downloads each file once.
export async function loadWoodTextures() {
  const loader = new THREE.TextureLoader();
  const [map, roughnessMap] = await Promise.all([loader.loadAsync(WOOD_TEXTURES.color), loader.loadAsync(WOOD_TEXTURES.roughness)]);
  map.colorSpace = THREE.SRGBColorSpace; // a color map: three.js turns its sRGB numbers into linear light
  // roughnessMap stays at NoColorSpace, the default: its numbers are used as they are.
  for (const texture of [map, roughnessMap]) {
    // Repeat, not clamp: the projected coordinates run far past one tile. (iJewel's file stores the
    // roughness map as ClampToEdge; its shader isn't in the files, so how it copes isn't known.)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.flipY = false; // as iJewel's file stores both; a seamless tile looks right either way
  }
  return { map, roughnessMap };
}
