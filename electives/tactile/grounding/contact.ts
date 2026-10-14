// A contact shadow: a soft dark patch on the ground wherever something is close to it, darkest where
// it touches. It needs no light. A camera lies on the ground looking straight up and photographs
// everything within `height` of the ground, each point darker the lower it is; the picture is
// blurred and laid on the ground as a see-through black. Draw it again with update() whenever
// something near the ground moves; otherwise it costs nothing.
import * as THREE from 'three';
import { FullScreenQuad } from 'three/addons/postprocessing/Pass.js';
import { HorizontalBlurShader } from 'three/addons/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/addons/shaders/VerticalBlurShader.js';

export interface ContactShadowOptions {
  width?: number; // the ground area it covers, in meters
  depth?: number;
  height?: number; // how far above the ground something still darkens it
  resolution?: number;
  blur?: number; // in texels of the picture
  darkness?: number; // 0 to 1, where something touches
}

export interface ContactShadow {
  plane: THREE.Mesh; // add it to the scene, just above the ground
  update(renderer: THREE.WebGLRenderer, scene: THREE.Scene): void;
  dispose(): void;
}

export function contactShadow({ width = 0.9, depth = 0.7, height = 0.06, resolution = 512, blur = 3, darkness = 0.85 }: ContactShadowOptions = {}): ContactShadow {
  const target = new THREE.WebGLRenderTarget(resolution, resolution);
  const blurTarget = new THREE.WebGLRenderTarget(resolution, resolution, { depthBuffer: false });

  // Looking up from the ground: its picture's top is +z, toward the viewer.
  const camera = new THREE.OrthographicCamera(-width / 2, width / 2, depth / 2, -depth / 2, 0, height);
  camera.rotation.x = Math.PI / 2;

  // Black, as opaque as the point is low: `darkness` at the ground, nothing at `height`.
  const heightMaterial = new THREE.ShaderMaterial({
    uniforms: { height: { value: height }, darkness: { value: darkness } },
    vertexShader: /* glsl */ `
      varying float vHeight;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vHeight = world.y;
        gl_Position = projectionMatrix * viewMatrix * world;
      }`,
    fragmentShader: /* glsl */ `
      uniform float height;
      uniform float darkness;
      varying float vHeight;
      void main() {
        gl_FragColor = vec4(0.0, 0.0, 0.0, (1.0 - clamp(vHeight / height, 0.0, 1.0)) * darkness);
      }`,
    side: THREE.DoubleSide,
  });

  // Each with its own copy of the uniforms: ShaderMaterial would otherwise share the module's.
  const horizontal = new THREE.ShaderMaterial({ ...HorizontalBlurShader, uniforms: THREE.UniformsUtils.clone(HorizontalBlurShader.uniforms) });
  const vertical = new THREE.ShaderMaterial({ ...VerticalBlurShader, uniforms: THREE.UniformsUtils.clone(VerticalBlurShader.uniforms) });
  horizontal.depthTest = vertical.depthTest = false;
  const quad = new FullScreenQuad();

  // The picture laid on the ground. The plane faces up; flipping it keeps the picture the right
  // way round, since the camera saw it from below.
  const geometry = new THREE.PlaneGeometry(width, depth).rotateX(Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({ map: target.texture, transparent: true, depthWrite: false });
  const plane = new THREE.Mesh(geometry, material);
  plane.scale.y = -1;
  plane.renderOrder = 1;
  plane.name = 'contact shadow';

  const blurOnce = (renderer: THREE.WebGLRenderer, amount: number) => {
    quad.material = horizontal;
    horizontal.uniforms.tDiffuse.value = target.texture;
    horizontal.uniforms.h.value = amount / resolution;
    renderer.setRenderTarget(blurTarget);
    quad.render(renderer);
    quad.material = vertical;
    vertical.uniforms.tDiffuse.value = blurTarget.texture;
    vertical.uniforms.v.value = amount / resolution;
    renderer.setRenderTarget(target);
    quad.render(renderer);
  };

  const clearColor = new THREE.Color();
  return {
    plane,
    update(renderer, scene) {
      plane.updateMatrixWorld();
      camera.position.setFromMatrixPosition(plane.matrixWorld);
      camera.updateMatrixWorld();
      const saved = {
        background: scene.background,
        override: scene.overrideMaterial,
        target: renderer.getRenderTarget(),
        alpha: renderer.getClearAlpha(),
        shadows: renderer.shadowMap.autoUpdate,
        visible: plane.visible,
      };
      renderer.getClearColor(clearColor);
      // Hide whatever lies on the ground itself, or it would darken everything.
      const flat: THREE.Object3D[] = [];
      scene.traverseVisible((object) => {
        if (object instanceof THREE.Mesh && object.userData.ground) flat.push(object);
      });
      for (const object of flat) object.visible = false;
      plane.visible = false;
      scene.background = null;
      scene.overrideMaterial = heightMaterial;
      renderer.shadowMap.autoUpdate = false;
      renderer.setRenderTarget(target);
      renderer.setClearColor(0x000000, 0);
      renderer.clear();
      renderer.render(scene, camera);
      blurOnce(renderer, blur);
      blurOnce(renderer, blur * 0.4);
      for (const object of flat) object.visible = true;
      plane.visible = saved.visible;
      scene.background = saved.background;
      scene.overrideMaterial = saved.override;
      renderer.shadowMap.autoUpdate = saved.shadows;
      renderer.setRenderTarget(saved.target);
      renderer.setClearColor(clearColor, saved.alpha);
    },
    dispose() {
      plane.removeFromParent();
      target.dispose();
      blurTarget.dispose();
      heightMaterial.dispose();
      horizontal.dispose();
      vertical.dispose();
      quad.dispose();
      geometry.dispose();
      material.dispose();
    },
  };
}
