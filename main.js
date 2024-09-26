import * as THREE from 'three';
import { scene, camera, renderer } from './scene-setup';
import Tentacle from './tentacle';


// Add AxesHelper to the scene
const axesHelper = new THREE.AxesHelper(5); // Size of the axes
scene.add(axesHelper);

const tentacle = new Tentacle({ scene});
tentacle.init();

function animate(deltaTime) {
    tentacle.update();
    renderer.render(scene, camera);
}

let prevTime = 0;

const tick = (time) => {
    const deltaTime = time - prevTime;
    prevTime = time;
    // console.log(deltaTime);

    animate(deltaTime);

    requestAnimationFrame(tick);

};

tick();