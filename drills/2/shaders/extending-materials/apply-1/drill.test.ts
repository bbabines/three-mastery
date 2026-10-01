import { answered } from '@harness/check';
import { MeshStandardMaterial, Texture, type WebGLRenderer } from 'three';
import { describe, expect, it } from 'vitest';
import { injectEmissivePulse } from './drill';
describe('injectEmissivePulse', () => {
 it('patches a Standard material without replacing its lighting shader', () => {
  const map = new Texture(), material = new MeshStandardMaterial({ color: '#aabbcc', map });
  const color = material.color.clone();
  expect(answered(injectEmissivePulse(material,.35))).toBe(material);
  const shader = { uniforms: {}, fragmentShader: '#include <common>\nvoid main() { vec3 totalEmissiveRadiance = vec3(0.0); #include <emissivemap_fragment> }' } as Parameters<MeshStandardMaterial['onBeforeCompile']>[0];
  material.onBeforeCompile(shader, {} as WebGLRenderer);
  expect(shader.uniforms.uPulse.value).toBe(.35);
  expect(shader.fragmentShader).toContain('#include <emissivemap_fragment>');
  expect(shader.fragmentShader).toContain('totalEmissiveRadiance += vec3(uPulse)');
  expect(shader.fragmentShader).toContain('uniform float uPulse');
  expect(material.map).toBe(map); expect(material.color.equals(color)).toBe(true);
 });
});
