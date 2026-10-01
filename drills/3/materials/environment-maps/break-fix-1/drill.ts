import {MeshStandardMaterial,Scene,Texture} from 'three';
export function chromeStage(scene:Scene,chrome:MeshStandardMaterial,lighting:Texture,backdrop:Texture):Scene {
 scene.background=backdrop;chrome.metalness=1;chrome.roughness=.1;return scene;
}
