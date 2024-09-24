import * as THREE from 'three';
import { scene, camera, renderer } from './scene-setup';
import { segmentsLow, segmentsHigh } from './tentacle';

// Create a secondary camera
const secondaryCamera = new THREE.PerspectiveCamera(75, 4 / 3, 0.1, 1000);
secondaryCamera.lookAt(secondaryCamera.position.x, secondaryCamera.position.y + 1, secondaryCamera.position.z);
segmentsHigh[segmentsHigh.length - 1].add(secondaryCamera);

// Create a secondary renderer
const secondaryRenderer = new THREE.WebGLRenderer({ antialias: true });
secondaryRenderer.setSize(window.innerHeight / 3, window.innerHeight / 4); // Smaller size for the pop-up window
secondaryRenderer.domElement.style.position = 'absolute';
secondaryRenderer.domElement.style.bottom = '10px';
secondaryRenderer.domElement.style.right = '10px';
document.body.appendChild(secondaryRenderer.domElement);

export { secondaryCamera, secondaryRenderer };

export const robotCanvas = secondaryRenderer.domElement;