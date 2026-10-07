// A gem material that traces light inside the stone, the way the playground's gems look. For each
// pixel it splits the light at the surface into a reflection and a part that bends inward, then
// follows the inward part from facet to facet with three-mesh-bvh ("which of this stone's own
// triangles does the light reach next?") until it's shallow enough to leave, and looks up the
// environment in the direction it leaves. Color comes from absorption: the longer the path inside,
// the deeper the color. Used by the gem shader unit and the capstone.
import * as THREE from 'three';
import { BVHShaderGLSL, MeshBVH, MeshBVHUniformStruct } from 'three-mesh-bvh';

export interface GemSettings {
  color: THREE.ColorRepresentation; // the stone's color; white for a diamond
  ior: number; // how strongly it bends light: glass 1.5, emerald 1.58, ruby 1.77, diamond 2.42
  bounces: number; // how many times to follow the light off the inside of a facet
  absorption: number; // how fast the color deepens with distance traveled inside
  dispersion: number; // how far apart red, green, and blue bend: 0 for none, ~0.04 for diamond fire
  envIntensity: number; // a multiplier on the environment, like iJewel's envMapIntensity
  boost: THREE.Vector3Like; // a per-channel multiplier on the color seen through the stone
}

// iJewel's settings for each stone in Spring, from its .dmat files (electives/jewelry/README.md).
// iJewel's diamond refraction is 2.6, above a real diamond's 2.42, for extra sparkle.
export const GEMS: Record<string, GemSettings> = {
  diamond: { color: 0xffffff, ior: 2.6, bounces: 5, absorption: 1, dispersion: 0, envIntensity: 1.3, boost: { x: 1, y: 1, z: 1 } },
  ruby: { color: 0xe14276, ior: 1.77, bounces: 5, absorption: 1.6, dispersion: 0, envIntensity: 1, boost: { x: 1.3, y: 0.16, z: 0.9 } },
  'yellow sapphire': { color: 0xf4e2ae, ior: 1.77, bounces: 5, absorption: 1.3, dispersion: 0, envIntensity: 1.03, boost: { x: 1.9, y: 1.8, z: 0.5 } },
  emerald: { color: 0x4fd5b3, ior: 1.58, bounces: 5, absorption: 1.8, dispersion: 0, envIntensity: 1, boost: { x: -0.3, y: 1, z: 1 } },
};

// The stone's color as the shader uses it: the hex digits as they are, not converted to linear the
// way a material's color is. Absorption raises this color to a power, and the raw digits keep more
// of the weaker channels (a ruby's blue), which matched the playground's pinker rubies. iJewel's
// files don't say how they use the color; this is a choice made by eye.
export const gemTint = (color: THREE.ColorRepresentation) => new THREE.Color(color).convertLinearToSRGB();

// Building a BVH sorts the geometry's triangles, so build one per geometry and share it.
const bvhs = new WeakMap<THREE.BufferGeometry, MeshBVH>();
export function gemBVH(geometry: THREE.BufferGeometry) {
  let bvh = bvhs.get(geometry);
  if (!bvh) {
    bvh = new MeshBVH(geometry);
    bvhs.set(geometry, bvh);
  }
  return bvh;
}

const MAX_BOUNCES = 12;

// modelMatrix only reaches the vertex shader, so it hands the stone's matrices on. They're the same
// at every corner, so blending them across the triangle changes nothing. Each stone draws with its
// own, so stones that share a material (one cut, placed many times) each trace in their own place.
const vertexShader = /* glsl */ `
  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying mat4 vStoneToWorld;
  varying mat4 vWorldToStone;
  void main() {
    vec4 world = modelMatrix * vec4( position, 1.0 );
    vWorldPosition = world.xyz;
    vWorldNormal = normalize( mat3( modelMatrix ) * normal );
    vStoneToWorld = modelMatrix;
    vWorldToStone = inverse( modelMatrix );
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp isampler2D;
  precision highp usampler2D;
  ${BVHShaderGLSL.common_functions}
  ${BVHShaderGLSL.bvh_struct_definitions}
  ${BVHShaderGLSL.bvh_ray_functions}
  #include <common>

  uniform BVH bvh;
  uniform sampler2D envMap;        // the gem environment, as a panorama
  uniform vec3 color;
  uniform vec3 boost;
  uniform float ior;
  uniform float absorption;
  uniform float dispersion;
  uniform float envIntensity;
  uniform float stoneSize;         // the stone's radius in its own units, so steps scale with it
  uniform int bounces;

  varying vec3 vWorldPosition;
  varying vec3 vWorldNormal;
  varying mat4 vStoneToWorld;
  varying mat4 vWorldToStone;

  vec3 environment( vec3 direction ) {
    return texture2D( envMap, equirectUv( direction ) ).rgb * envIntensity;
  }

  // Follows light that has just bent into the stone. Returns the direction it leaves in, in the
  // world, and how far it traveled inside, measured in stone radii.
  vec3 traceInside( vec3 direction, float bendStrength, out float traveled ) {
    vec3 origin = ( vWorldToStone * vec4( vWorldPosition, 1.0 ) ).xyz;
    vec3 dir = normalize( ( vWorldToStone * vec4( direction, 0.0 ) ).xyz );
    origin += dir * stoneSize * 1e-4;
    traveled = 0.0;
    for ( int i = 0; i < ${MAX_BOUNCES}; i ++ ) {
      uvec4 faceIndices; vec3 faceNormal; vec3 barycoord; float side; float dist;
      if ( ! bvhIntersectFirstHit( bvh, origin, dir, faceIndices, faceNormal, barycoord, side, dist ) ) break;
      traveled += dist / stoneSize;
      vec3 hit = origin + dir * dist;
      // faceNormal faces back toward the light, as GLSL's refract expects.
      vec3 out_ = refract( dir, faceNormal, bendStrength );
      if ( dot( out_, out_ ) > 0.0 || i >= bounces ) { dir = dot( out_, out_ ) > 0.0 ? out_ : dir; break; }
      dir = reflect( dir, faceNormal ); // too steep to leave: it bounces off the inside
      origin = hit + dir * stoneSize * 1e-4;
    }
    return normalize( ( vStoneToWorld * vec4( dir, 0.0 ) ).xyz );
  }

  void main() {
    vec3 view = normalize( vWorldPosition - cameraPosition );
    vec3 normal = normalize( vWorldNormal );
    if ( dot( normal, view ) > 0.0 ) normal = - normal;

    // Light through the stone, one color channel at a time when dispersion splits them.
    vec3 through;
    vec3 tint = max( color * boost, vec3( 0.0 ) );
    for ( int c = 0; c < 3; c ++ ) {
      float channelIor = ior + ( float( c ) - 1.0 ) * dispersion;
      float traveled;
      vec3 leaving = traceInside( refract( view, normal, 1.0 / channelIor ), channelIor, traveled );
      vec3 seen = environment( leaving ) * pow( max( tint, vec3( 1e-4 ) ), vec3( traveled * absorption ) );
      through[ c ] = seen[ c ];
      if ( dispersion == 0.0 ) { through = seen; break; }
    }

    // The reflection off the surface, stronger at grazing angles (Fresnel, Schlick's version).
    float f0 = pow( ( ior - 1.0 ) / ( ior + 1.0 ), 2.0 );
    float fresnel = f0 + ( 1.0 - f0 ) * pow( 1.0 - max( dot( - view, normal ), 0.0 ), 5.0 );
    vec3 reflected = environment( reflect( view, normal ) );

    gl_FragColor = vec4( mix( through, reflected, fresnel ), 1.0 );
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

// A gem material for one stone geometry. `envMap` is the raw gem panorama (environmentImage('gem')
// in shared.ts), not a PMREM texture: the shader looks up exact directions in it.
export function gemMaterial(geometry: THREE.BufferGeometry, envMap: THREE.Texture, settings: GemSettings) {
  const bvh = new MeshBVHUniformStruct();
  bvh.updateFrom(gemBVH(geometry));
  if (!geometry.boundingSphere) geometry.computeBoundingSphere();
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      bvh: { value: bvh },
      envMap: { value: envMap },
      color: { value: gemTint(settings.color) },
      boost: { value: new THREE.Vector3().copy(settings.boost) },
      ior: { value: settings.ior },
      absorption: { value: settings.absorption },
      dispersion: { value: settings.dispersion },
      envIntensity: { value: settings.envIntensity },
      stoneSize: { value: geometry.boundingSphere!.radius },
      bounces: { value: settings.bounces },
    },
  });
  material.addEventListener('dispose', () => bvh.dispose());
  return material;
}
