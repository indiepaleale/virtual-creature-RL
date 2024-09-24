import * as THREE from 'three';
import { mapLinear } from 'three/src/math/MathUtils.js';
import { scene, camera, renderer } from './scene-setup';
import { updateTentacle } from './tentacle';
import { secondaryCamera, secondaryRenderer } from "./second-camera";
import "./hydra";

// Add AxesHelper to the scene
const axesHelper = new THREE.AxesHelper(5); // Size of the axes
scene.add(axesHelper);

function animate(deltaTime) {
    updateTentacle(deltaTime);
    renderer.render(scene, camera);
    secondaryRenderer.render(scene, secondaryCamera);
}

let prevTime = 0;
const tick = (time) => {
    const deltaTime = time - prevTime;
    prevTime = time;
    //console.log(deltaTime);

    animate(deltaTime);

    requestAnimationFrame(tick);

};

tick();