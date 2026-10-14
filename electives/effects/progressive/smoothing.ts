// Smoothing by averaging frames, for the progressive and smoothing-while-moving pages. r186 has no
// node that averages still frames in WebGPU (TRAANode blends old frames in at a fixed rate and
// follows motion), so this is the progressive pass built the plain way: each frame the camera
// shifts by a different fraction of a pixel, and the frame is blended into a running average.
// A magnifier enlarges the middle of the picture with each pixel kept square, so stair steps show.
import { Fn, context, floor, int, mix, passTexture, texture, uniform, uv, vec2 } from 'three/tsl';
import * as THREE from 'three/webgpu';

// Shared by every average; it's given back its blank material after each use, so it never keeps a
// left page's material (and through it that page's renderer) in memory.
const blank = new THREE.NodeMaterial();
const quad = new THREE.QuadMesh(blank);
const drawingSize = new THREE.Vector2();
let rendererState: unknown;

// Halton (2, 3): well-spread sub-pixel spots. The first is the pixel's center, so one frame
// matches an unshifted render.
function halton(index: number, base: number) {
  let result = 0;
  let fraction = 1 / base;
  for (let i = index; i > 0; i = Math.floor(i / base)) {
    result += (i % base) * fraction;
    fraction /= base;
  }
  return result;
}
export const JITTER = Array.from({ length: 32 }, (_, i) => (i === 0 ? [0.5, 0.5] : [halton(i, 2), halton(i, 3)]));

type NodeFrame = Parameters<THREE.TempNode<'vec4'>['updateBefore']>[0];
type NodeBuilder = Parameters<THREE.TempNode<'vec4'>['setup']>[0];

// A running average of `beauty`. In 'average' mode each new frame counts 1/n, so after n frames
// each one counts the same; once `maxFrames` are in, it stops, and the scene isn't drawn again
// until `restart()`. In 'blend' mode each new frame always counts `blendWeight`, forever, and the
// camera isn't shifted: what a temporal pass does when it doesn't follow motion.
export class AccumulateNode extends THREE.TempNode<'vec4'> {
  frames = 0;
  maxFrames: number;
  mode: 'average' | 'blend' = 'average';
  blendWeight = 0.1;
  // Starts over after maxFrames instead of stopping: keeps averaging, to time a frame of it.
  loop = false;
  private beauty: THREE.TextureNode;
  private weight = uniform(1);
  private history = new THREE.RenderTarget(1, 1, { depthBuffer: false, type: THREE.HalfFloatType });
  private resolve = new THREE.RenderTarget(1, 1, { depthBuffer: false, type: THREE.HalfFloatType });
  private material = new THREE.NodeMaterial();
  private output: THREE.TextureNode;

  constructor(beauty: THREE.TextureNode, maxFrames = 32) {
    super('vec4');
    this.beauty = beauty;
    this.maxFrames = maxFrames;
    this.updateBeforeType = THREE.NodeUpdateType.FRAME;
    this.output = passTexture(this as never, this.resolve.texture) as unknown as THREE.TextureNode;
  }

  get done() {
    return this.mode === 'average' && !this.loop && this.frames >= this.maxFrames;
  }

  // Whether the next frame should shift the camera: only while averaging still frames.
  get jittering() {
    return this.mode === 'average' && !this.done;
  }

  restart() {
    this.frames = 0;
  }

  getTextureNode() {
    return this.output;
  }

  updateBefore(frame: NodeFrame) {
    const renderer = frame.renderer as THREE.WebGPURenderer;
    if (this.done) return; // nothing new: the scene pass isn't drawn either
    if (this.loop && this.frames >= this.maxFrames) this.frames = 0;
    renderer.getDrawingBufferSize(drawingSize);
    if (this.resolve.width !== drawingSize.x || this.resolve.height !== drawingSize.y) {
      this.history.setSize(drawingSize.x, drawingSize.y);
      this.resolve.setSize(drawingSize.x, drawingSize.y);
      renderer.initRenderTarget(this.history);
      renderer.initRenderTarget(this.resolve);
      this.frames = 0;
    }
    this.frames++;
    this.weight.value = this.mode === 'average' ? 1 / this.frames : this.frames === 1 ? 1 : this.blendWeight;

    rendererState = THREE.RendererUtils.resetRendererState(renderer, rendererState as never);
    renderer.setRenderTarget(this.resolve);
    quad.material = this.material;
    quad.render(renderer); // draws the scene pass first, since the blend reads it
    quad.material = blank;
    renderer.setRenderTarget(null);
    renderer.copyTextureToTexture(this.resolve.texture, this.history.texture);
    THREE.RendererUtils.restoreRendererState(renderer, rendererState as never);
    return undefined;
  }

  setup(builder: NodeBuilder) {
    // new × weight + average so far × (1 − weight)
    const shared = (builder as unknown as { getSharedContext(): object }).getSharedContext();
    this.material.contextNode = context(shared as never);
    this.material.colorNode = mix(texture(this.history.texture), this.beauty.sample(uv()), this.weight);
    this.material.needsUpdate = true;
    return this.output;
  }

  dispose() {
    super.dispose();
    this.history.dispose();
    this.resolve.dispose();
    this.material.dispose();
  }
}

// Shifts the camera by part of a pixel for frame `index` of an average. Call before drawing, and
// camera.clearViewOffset() after.
export function jitter(camera: THREE.PerspectiveCamera, renderer: THREE.WebGPURenderer, index: number) {
  renderer.getDrawingBufferSize(drawingSize);
  const [x, y] = JITTER[index % JITTER.length];
  camera.setViewOffset(drawingSize.x, drawingSize.y, x - 0.5, y - 0.5, drawingSize.x, drawingSize.y);
}

// The spot `center` of the picture (0 to 1 across and down), `zoom` times closer, each pixel
// drawn as a square block.
export function magnify(node: THREE.TextureNode, zoom = 4, center: [number, number] = [0.5, 0.5]) {
  return Fn(() => {
    const size = vec2(node.size(int(0)) as never);
    const spot = uv().sub(0.5).div(zoom).add(vec2(...center));
    return node.sample(floor(spot.mul(size)).add(0.5).div(size));
  })();
}

// Notices when the camera has moved since the last call. Moves under a millionth of a unit don't
// count: OrbitControls' damping shrinks the last move each frame without ever reaching zero, and
// on a slow frame rate that tail lasts for seconds.
export function moveWatcher(camera: THREE.Camera) {
  const last = new THREE.Matrix4();
  const projection = new THREE.Matrix4();
  const differs = (a: THREE.Matrix4, b: THREE.Matrix4) => a.elements.some((value, i) => Math.abs(value - b.elements[i]) > 1e-6);
  return () => {
    const moved = differs(last, camera.matrixWorld) || differs(projection, camera.projectionMatrix);
    last.copy(camera.matrixWorld);
    projection.copy(camera.projectionMatrix);
    return moved;
  };
}
