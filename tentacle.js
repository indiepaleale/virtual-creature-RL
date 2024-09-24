import * as THREE from 'three';
import { scene } from './scene-setup';
import { mapLinear } from 'three/src/math/MathUtils.js';
import { Noise } from 'noisejs';
import control from "./control";

// draw spines
export const segmentsLow = [];
export const segmentsHigh = [];

const noise = new Noise(Math.random());

const vertabraeCount = 9;
const angleLimit = Math.PI / 12;

// Three.js geometry and material
const geometry = new THREE.CylinderGeometry(2, 2, 0.5, 36);
const materialLow = new THREE.MeshPhongMaterial({ color: 0x9090ee });
const materialHigh = new THREE.MeshPhongMaterial({ color: 0x90ee90 });

const rootSegment = new THREE.Mesh(geometry, materialLow);
segmentsLow.push(rootSegment);

while(segmentsLow.length < vertabraeCount) {
    let vertabrae = new THREE.Mesh(geometry, materialLow);
    vertabrae.position.y += 2;
    if (segmentsLow.length > 0) {
        segmentsLow[segmentsLow.length - 1].add(vertabrae);
    }
    else {
        rootSegment.add(vertabrae);
    }
    segmentsLow.push(vertabrae);
}

const rootSegmentHigh = segmentsLow[segmentsLow.length - 1];

while(segmentsHigh.length < vertabraeCount) {
    let vertabrae = new THREE.Mesh(geometry, materialHigh);
    vertabrae.position.y += 2;
    if (segmentsHigh.length > 0) {
        segmentsHigh[segmentsHigh.length - 1].add(vertabrae);
    }
    else {
        rootSegmentHigh.add(vertabrae);
    }
    segmentsHigh.push(vertabrae);
}

scene.add(rootSegment);

const clock = new THREE.Clock();

export function updateTentacle() {
    const noiseTime = clock.getElapsedTime() * 0.2;
    
    const noiseLx = noise.simplex2(noiseTime, 0);
    const noiseLz = noise.simplex2(noiseTime, 10);
    const noiseHx = noise.simplex2(0, noiseTime);
    const noiseHz = noise.simplex2(10, noiseTime);

    for (let segment of segmentsLow) {
        segment.rotation.x = mapLinear(noiseLx, -1, 1, -angleLimit, angleLimit);
        segment.rotation.z = mapLinear(noiseLz, -1, 1, -angleLimit, angleLimit);
    }

    for (let segment of segmentsHigh) {
        segment.rotation.x = mapLinear(noiseHx, -1, 1, -angleLimit, angleLimit);
        segment.rotation.z = mapLinear(noiseHz, -1, 1, -angleLimit, angleLimit);
    }
}