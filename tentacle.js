import * as THREE from 'three';
import { mapLinear } from 'three/src/math/MathUtils.js';
import { Noise } from 'noisejs';
import RobotCam from './second-camera';
import { hydra, hydraSetup } from './hydra';
import control from "./control";
import RLearning from './RLearning';

// import './RLearning';

export default class Tentacle {
    constructor({ scene, sectionCount = 2, segmentCount = 9, angleLimit = Math.PI / 12 }) {
        this.sectionCount = sectionCount;
        this.segmentCount = segmentCount;
        this.scene = scene;
        this.angleLimit = angleLimit;

        this.segmentsLow = [];
        this.segmentsHigh = [];
        this.robotCam = new RobotCam(scene, window.innerWidth / 3, window.innerWidth / 4);

        this.noise = new Noise(Math.random());
        this.clock = new THREE.Clock();
    }

    init = () => {
        const geometry = new THREE.CylinderGeometry(2, 2, 0.5, 36);
        const materialLow = new THREE.MeshPhongMaterial({ color: 0x9090ee });
        const materialHigh = new THREE.MeshPhongMaterial({ color: 0x90ee90 });

        const rootSegment = new THREE.Mesh(geometry, materialLow);
        this.segmentsLow.push(rootSegment);

        while (this.segmentsLow.length < this.segmentCount) {
            let vertabrae = new THREE.Mesh(geometry, materialLow);
            vertabrae.position.y += 2;
            if (this.segmentsLow.length > 0) {
                this.segmentsLow[this.segmentsLow.length - 1].add(vertabrae);
            }
            else {
                rootSegment.add(vertabrae);
            }
            this.segmentsLow.push(vertabrae);
        }

        const rootSegmentHigh = this.segmentsLow[this.segmentsLow.length - 1];

        while (this.segmentsHigh.length < this.segmentCount) {
            let vertabrae = new THREE.Mesh(geometry, materialHigh);
            vertabrae.position.y += 2;
            if (this.segmentsHigh.length > 0) {
                this.segmentsHigh[this.segmentsHigh.length - 1].add(vertabrae);
            }
            else {
                rootSegmentHigh.add(vertabrae);
            }
            this.segmentsHigh.push(vertabrae);
        }

        this.robotCam.root = this.segmentsHigh[this.segmentsHigh.length - 1];
        this.robotCam.root.add(this.robotCam.camera);

        this.scene.add(rootSegment);

        hydraSetup(hydra, this.robotCam.renderer.domElement);

    }

    update = () => {

        // Movement from noise
        const noiseTime = this.clock.getElapsedTime() * 0.2;

        const noiseLx = this.noise.simplex2(noiseTime, 0);
        const noiseLz = this.noise.simplex2(noiseTime, 10);
        const noiseHx = this.noise.simplex2(0, noiseTime);
        const noiseHz = this.noise.simplex2(10, noiseTime);

        for (let segment of this.segmentsLow) {
            segment.rotation.x = mapLinear(noiseLx, -1, 1, -this.angleLimit, this.angleLimit);
            segment.rotation.z = mapLinear(noiseLz, -1, 1, -this.angleLimit, this.angleLimit);
        }

        for (let segment of this.segmentsHigh) {
            segment.rotation.x = mapLinear(noiseHx, -1, 1, -this.angleLimit, this.angleLimit);
            segment.rotation.z = mapLinear(noiseHz, -1, 1, -this.angleLimit, this.angleLimit);
        }

        this.robotCam.render(); 
    }

}