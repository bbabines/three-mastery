import type { Harness } from '@harness/scene';
import * as THREE from 'three';
import type { Finishing } from './finishing';
import type { GroundSettings } from './ground';

export type EnvironmentMode = 'reference' | 'uniform' | 'panels' | 'hard-panels' | 'room';
export interface PanelSettings { count: number; width: number; softness: number; background: number } // width is angular half-width in radians
export interface WatchAudit {
  materials: {name: string; roughness: number; metalness: number; baseColor: number[]}[];
  extensionsUsed: string[];
  scene: {envMapIntensity: number; defaultCamera: {camOptions: {fov: number}}};
}
export type ReferenceView = 'default' | 'front';
export interface ReferenceCapture {
  views: Record<ReferenceView, {file: string; camera: {position: number[]; target: number[]; fov: number}; modelBox: {min: number[]; max: number[]}}>;
  settings: {environmentIntensity: number; environmentRotation: [number, number, number, string]};
}
// The studio's brightness: WebGi's live value and the stage's calibrated one. r186 lights a partly
// metallic surface with more environment light than WebGi's three r163 does (README, "Original
// versus native"), so the stage turns the studio down to match the captures.
export interface EnvironmentCalibration {
  source: number; // the live site's environmentIntensity (reference-capture.json)
  factor: number; // measured against both captures
  calibrated: number; // source × factor: what the stage uses by default
}
// The three parts of the reference look that experiments switch off to isolate one variable.
export interface ReferenceLookParts {
  light: boolean; // the GLB's own key light (light_0, intensity 20) and its shadow
  ground: boolean; // white reflective floor: contact shadow, key-light shadow, planar reflection
  finishing: boolean; // AO on environment light → 32-frame accumulation (HDR clamped at 8) → bloom → tone map + contrast 1.1
  // WebGi's fixedEnvMapDirection: the studio turns with the camera, so orbiting never changes the
  // reflections. scene.environmentRotation is then measured from the camera, not the world.
  studioFollowsCamera: boolean;
}

// Every experiment gets the stage in its reference look: studio EXR (calibrated intensity), light_0,
// the ground, white background, finishing on, and the camera at the WebGi capture's default view.
export interface ProductLab {
  harness: Harness; // harness.scene is the scene the stage draws
  model: THREE.Group;
  materials: Map<string, THREE.MeshStandardMaterial>;
  strap: THREE.MeshStandardMaterial;
  normalTexture: THREE.Texture;
  environment: THREE.DataTexture;
  audit: WatchAudit;
  ui: HTMLElement;
  readout: HTMLElement;
  referenceLight: THREE.DirectionalLight;
  ground: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshStandardMaterial>;
  groundSettings: GroundSettings; // live: size, contact shadowHeight, blur, reflection strength
  // The stage's composer and passes (render, ao, accumulate, bloom, output with contrast and
  // saturation). Change their settings freely; the stage owns sizing, drawing, and disposal.
  finishing: Finishing;
  // Turn parts of the reference look on or off; omitted parts keep their state.
  setReferenceLook(parts: Partial<ReferenceLookParts>): void;
  getReferenceLook(): ReferenceLookParts;
  setView(view: ReferenceView): void; // the WebGi capture's cameras, in stage units
  setEnvironment(mode: EnvironmentMode): void;
  setPanels(settings: PanelSettings): void;
  environmentCalibration: EnvironmentCalibration;
  // true (the default): scene.environmentIntensity = calibrated; false: the source value.
  useCalibratedEnvironment(calibrated: boolean): void;
  setReadout(text: string): void;
  // Controls added here restart the still's accumulation (and redraw a paused preview).
  addButton(label: string, action: () => void): HTMLButtonElement;
  addSlider(label: string, min: number, max: number, step: number, initial: number, action: (value: number) => void): HTMLInputElement;
  addSelect(label: string, options: Record<string, () => void>): HTMLSelectElement;
  registerEvidence(read: () => Record<string, unknown>): void;
  onLeave(stop: () => void): void;
  captureOrbit(): void;
  // Replaces the stage's drawing entirely (live and paused); null restores it.
  setCaptureRenderer(draw: (() => void) | null): void;
  beforeDraw(update: () => void): void;
  // Redraw after a change made outside the stage's controls; restarts accumulation.
  redraw(): void;
  // Render a converged still (default 32 samples) and return a copy of it.
  still(samples?: number): HTMLCanvasElement;
}

// Implemented by the shared stage; unit modules own their experiments.
export { watchLab } from './stage';
