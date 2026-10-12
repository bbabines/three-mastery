import type { Harness } from '@harness/scene';
import * as THREE from 'three';

export type EnvironmentMode = 'reference' | 'uniform' | 'panels' | 'hard-panels' | 'room';
export interface PanelSettings { count: number; width: number; softness: number; background: number } // width is angular half-width in radians
export interface WatchAudit {
  materials: {name: string; roughness: number; metalness: number; baseColor: number[]}[];
  extensionsUsed: string[];
  scene: {envMapIntensity: number; defaultCamera: {camOptions: {fov: number}}};
}
export interface ProductLab {
  harness: Harness;
  model: THREE.Group;
  materials: Map<string, THREE.MeshStandardMaterial>;
  strap: THREE.MeshStandardMaterial;
  normalTexture: THREE.Texture;
  environment: THREE.DataTexture;
  audit: WatchAudit;
  ui: HTMLElement;
  readout: HTMLElement;
  setEnvironment(mode: EnvironmentMode): void;
  setPanels(settings: PanelSettings): void;
  setReadout(text: string): void;
  addButton(label: string, action: () => void): HTMLButtonElement;
  addSlider(label: string, min: number, max: number, step: number, initial: number, action: (value: number) => void): HTMLInputElement;
  addSelect(label: string, options: Record<string, () => void>): HTMLSelectElement;
  registerEvidence(read: () => Record<string, unknown>): void;
  onLeave(stop: () => void): void;
  captureOrbit(): void;
  setCaptureRenderer(draw: (() => void) | null): void;
  beforeDraw(update: () => void): void;
  redraw(): void;
}

// Implemented by the shared stage; unit modules own their experiments.
export { watchLab } from './stage';
