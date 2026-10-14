import * as THREE from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

// The reference's ground, rebuilt with native r186 parts. WebGi's ContactShadowGroundPlugin uses a
// white floor (roughness 0.25, metalness 0.782) that is not tone mapped. Its contact shadow is a
// depth image of the product seen from under the floor, blurred and used as the floor's aoMap, so
// it only darkens the floor's environment light. The key light's shadow map darkens the rest.
// WebGi reflects the product in the floor with screen-space reflections; here a planar mirror
// render does that job (exact for a flat floor), sampled with a small per-frame offset so the
// accumulated still shows roughness-0.25 blur.
export interface GroundSettings {
  size: number; // floor width in stage units
  shadowHeight: number; // contact shadow fades to nothing at this height above the floor
  blur: number; // WebGi blurAmount: 1 → the two blur passes step 1/256 and 0.4/256 of the image
  reflection: number; // 0 turns the planar reflection off
}

export interface ReferenceGround {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  settings: GroundSettings;
  // Renders this frame's floor reflection, and the contact-shadow depth when the product or ground
  // moved since it was last drawn. `sample` picks the reflection's blur offset; 0 is unjittered.
  update(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, sample: number): void;
  // In the finishing chain the floor writes alpha 0, which the output pass reads as "do not tone
  // map", as WebGi does for its ground. Drawn straight to the canvas it uses toneMapped = false.
  setComposited(composited: boolean): void;
  dispose(): void;
}

const MIRROR_SIZE_SCALE = 0.5;

export function createReferenceGround(scale: number): ReferenceGround {
  const settings: GroundSettings = {size: 20 * scale, shadowHeight: 5 * scale, blur: 1, reflection: 1};
  const geometry = new THREE.PlaneGeometry(1, 1);
  geometry.rotateX(-Math.PI / 2);
  // After the rotation v runs toward −z; the contact camera's image runs toward +z. Flip v once here.
  const uv = geometry.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
  const material = new THREE.MeshStandardMaterial({color: 0xffffff, roughness: 0.25, metalness: 0.7820321917322556, name: 'reference ground'});
  material.toneMapped = false;
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = 'reference ground';
  mesh.receiveShadow = true;
  mesh.castShadow = false;

  // Contact shadow: orthographic depth from below, as WebGi renders it (white = nothing above).
  const contactTarget = new THREE.WebGLRenderTarget(512, 512, {type: THREE.HalfFloatType});
  const blurTarget = new THREE.WebGLRenderTarget(512, 512, {type: THREE.HalfFloatType, depthBuffer: false});
  contactTarget.texture.name = 'reference ground contact depth';
  const contactCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.001, 1);
  contactCamera.rotation.x = Math.PI / 2; // look straight up from the floor
  const depthMaterial = new THREE.ShaderMaterial({
    name: 'contact shadow depth',
    side: THREE.DoubleSide,
    vertexShader: 'void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    // Orthographic depth is linear: 0 touching the floor, 1 at shadowHeight.
    fragmentShader: 'void main() { gl_FragColor = vec4(vec3(gl_FragCoord.z), 1.0); }',
  });
  const horizontal = new THREE.ShaderMaterial({...HorizontalBlurShader, uniforms: THREE.UniformsUtils.clone(HorizontalBlurShader.uniforms), depthTest: false});
  const vertical = new THREE.ShaderMaterial({...VerticalBlurShader, uniforms: THREE.UniformsUtils.clone(VerticalBlurShader.uniforms), depthTest: false});
  const quad = new FullScreenQuad();
  material.aoMap = contactTarget.texture;
  material.aoMapIntensity = 1;

  // Planar reflection, built like three's Reflector without its oblique clip (nothing sits below
  // the floor). Alpha marks where the mirror sees the product; elsewhere the environment shows.
  const mirrorTarget = new THREE.WebGLRenderTarget(1, 1, {type: THREE.HalfFloatType});
  mirrorTarget.texture.name = 'reference ground reflection';
  const mirrorCamera = new THREE.PerspectiveCamera();
  const uniforms = {
    tMirror: {value: mirrorTarget.texture},
    mirrorMatrix: {value: new THREE.Matrix4()},
    mirrorOffset: {value: new THREE.Vector2()},
    mirrorStrength: {value: 1},
    maskOut: {value: 0},
  };
  material.onBeforeCompile = shader => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nuniform mat4 mirrorMatrix;\nvarying vec4 vMirrorCoord;')
      .replace('#include <project_vertex>', '#include <project_vertex>\nvMirrorCoord = mirrorMatrix * vec4(transformed, 1.0);');
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D tMirror;\nuniform vec2 mirrorOffset;\nuniform float mirrorStrength;\nuniform float maskOut;\nvarying vec4 vMirrorCoord;')
      .replace('#include <lights_fragment_maps>', `#include <lights_fragment_maps>
#if defined( RE_IndirectSpecular )
  vec4 mirrored = texture2D(tMirror, vMirrorCoord.xy / vMirrorCoord.w + mirrorOffset);
  radiance = mix(radiance, mirrored.rgb, mirrored.a * mirrorStrength);
#endif`)
      .replace('#include <dithering_fragment>', '#include <dithering_fragment>\ngl_FragColor.a *= 1.0 - maskOut;');
  };
  material.customProgramCacheKey = () => 'reference-ground-v1';

  const hidden: THREE.Object3D[] = [];
  const hide = (scene: THREE.Scene, alsoTransmissive: boolean) => {
    hidden.length = 0;
    scene.traverseVisible(object => {
      if (object === mesh) hidden.push(object);
      else if (alsoTransmissive && object instanceof THREE.Mesh) {
        const materials = Array.isArray(object.material) ? object.material : [object.material];
        if (materials.some(m => (m as THREE.MeshPhysicalMaterial).transmission > 0)) hidden.push(object);
      }
    });
    for (const object of hidden) object.visible = false;
  };
  const show = () => { for (const object of hidden) object.visible = true; hidden.length = 0; };

  const size = new THREE.Vector2();
  const normal = new THREE.Vector3(0, 1, 0);
  const planePoint = new THREE.Vector3();
  const cameraPoint = new THREE.Vector3();
  const rotation = new THREE.Matrix4();
  const look = new THREE.Vector3();
  const target = new THREE.Vector3();
  const view = new THREE.Vector3();
  const clear = new THREE.Color();
  const bias = new THREE.Matrix4().set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1);

  // The contact shadow depends only on the product's shape and place and on the ground, never on
  // the camera or the light, so it is drawn again only when one of those changed: this key lists
  // the ground's settings and position, then every visible mesh's world matrix.
  let contactKey: number[] = [];
  const nextKey: number[] = [];
  const contactChanged = (scene: THREE.Scene) => {
    nextKey.length = 0;
    nextKey.push(settings.size, settings.shadowHeight, settings.blur, ...mesh.matrixWorld.elements);
    scene.traverseVisible(object => {
      if (object instanceof THREE.Mesh && object !== mesh) nextKey.push(object.id, object.geometry.id, ...object.matrixWorld.elements);
    });
    if (nextKey.length === contactKey.length && nextKey.every((value, i) => value === contactKey[i])) return false;
    contactKey = [...nextKey];
    return true;
  };

  const renderContact = (renderer: THREE.WebGLRenderer, scene: THREE.Scene) => {
    const half = settings.size / 2;
    Object.assign(contactCamera, {left: -half, right: half, top: half, bottom: -half, far: settings.shadowHeight});
    contactCamera.updateProjectionMatrix();
    mesh.getWorldPosition(contactCamera.position);
    contactCamera.updateMatrixWorld();
    const background = scene.background, override = scene.overrideMaterial;
    scene.background = null;
    scene.overrideMaterial = depthMaterial;
    renderer.setRenderTarget(contactTarget);
    renderer.setClearColor(0xffffff, 1);
    renderer.clear();
    renderer.render(scene, contactCamera);
    scene.overrideMaterial = override;
    scene.background = background;
    // WebGi blurs twice: step blur/256, then 0.4 × blur/256 (UV units of the 512 image).
    for (const step of [settings.blur / 256, 0.4 * settings.blur / 256]) {
      horizontal.uniforms.tDiffuse.value = contactTarget.texture; horizontal.uniforms.h.value = step;
      renderer.setRenderTarget(blurTarget); quad.material = horizontal; quad.render(renderer);
      vertical.uniforms.tDiffuse.value = blurTarget.texture; vertical.uniforms.v.value = step;
      renderer.setRenderTarget(contactTarget); quad.material = vertical; quad.render(renderer);
    }
  };

  const renderMirror = (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, sample: number) => {
    mesh.getWorldPosition(planePoint);
    cameraPoint.setFromMatrixPosition(camera.matrixWorld);
    view.subVectors(planePoint, cameraPoint);
    if (settings.reflection <= 0 || view.dot(normal) > 0) { uniforms.mirrorStrength.value = 0; return; }
    uniforms.mirrorStrength.value = settings.reflection;
    view.reflect(normal).negate().add(planePoint);
    rotation.extractRotation(camera.matrixWorld);
    look.set(0, 0, -1).applyMatrix4(rotation).add(cameraPoint);
    target.subVectors(planePoint, look).reflect(normal).negate().add(planePoint);
    mirrorCamera.position.copy(view);
    mirrorCamera.up.set(0, 1, 0).applyMatrix4(rotation).reflect(normal);
    mirrorCamera.lookAt(target);
    mirrorCamera.far = camera.far;
    mirrorCamera.updateMatrixWorld();
    mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);
    mirrorCamera.projectionMatrixInverse.copy(camera.projectionMatrixInverse);
    uniforms.mirrorMatrix.value.copy(bias).multiply(mirrorCamera.projectionMatrix).multiply(mirrorCamera.matrixWorldInverse).multiply(mesh.matrixWorld);
    renderer.getDrawingBufferSize(size);
    const width = Math.max(1, Math.round(size.x * MIRROR_SIZE_SCALE)), height = Math.max(1, Math.round(size.y * MIRROR_SIZE_SCALE));
    if (mirrorTarget.width !== width || mirrorTarget.height !== height) mirrorTarget.setSize(width, height);
    const background = scene.background;
    scene.background = null;
    renderer.setRenderTarget(mirrorTarget);
    renderer.setClearColor(0x000000, 0);
    renderer.clear();
    renderer.render(scene, mirrorCamera);
    scene.background = background;
    // Roughness 0.25 blur: a different small offset each accumulated frame (golden-angle disk).
    if (sample === 0) uniforms.mirrorOffset.value.set(0, 0);
    else {
      const radius = 0.012 * Math.sqrt((sample % 32) / 32), angle = sample * 2.399963;
      uniforms.mirrorOffset.value.set(Math.cos(angle) * radius * height / width, Math.sin(angle) * radius);
    }
  };

  return {
    mesh, settings,
    update(renderer, scene, camera, sample) {
      mesh.scale.set(settings.size, 1, settings.size);
      mesh.updateMatrixWorld();
      if (!mesh.visible) return;
      const previousTarget = renderer.getRenderTarget();
      renderer.getClearColor(clear);
      const clearAlpha = renderer.getClearAlpha();
      try {
        if (contactChanged(scene)) {
          hide(scene, false);
          renderContact(renderer, scene);
          show();
        }
        hide(scene, true);
        renderMirror(renderer, scene, camera, sample);
      } finally {
        show();
        renderer.setRenderTarget(previousTarget);
        renderer.setClearColor(clear, clearAlpha);
      }
    },
    setComposited(composited) { uniforms.maskOut.value = composited ? 1 : 0; },
    dispose() {
      geometry.dispose(); material.dispose(); depthMaterial.dispose(); horizontal.dispose(); vertical.dispose();
      quad.dispose(); contactTarget.dispose(); blurTarget.dispose(); mirrorTarget.dispose();
    },
  };
}
