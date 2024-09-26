import * as THREE from 'three';

export default class RobotCam {
    constructor(scene, width, height) {
        this.scene = scene;
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderTarget = new THREE.WebGLRenderTarget(width, height);
        this.root = null;
        this.pixelBuffer = null;

        this.init(width, height);
    }

    init = (width, height) => {
        this.camera.lookAt(this.camera.position.x, this.camera.position.y + 1, this.camera.position.z);
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = 'absolute';
        this.renderer.domElement.style.bottom = '10px';
        this.renderer.domElement.style.right = '10px';
        document.body.appendChild(this.renderer.domElement);

    }

    render = () => {
        this.renderer.setRenderTarget(this.renderTarget);
        this.renderer.render(this.scene, this.camera);
        this.renderer.setRenderTarget(null);
        this.renderer.render(this.scene, this.camera);
        
        this.updatePixelBuffer(8, 8);
        
    }


    updatePixelBuffer = (width, height) => {
        const nativeWidth = this.renderTarget.width;
        const nativeHeight = this.renderTarget.height;
        const pixelBuffer = new Uint8Array(nativeWidth * nativeHeight * 4);
        this.renderer.readRenderTargetPixels(this.renderTarget, 0, 0, width, height, pixelBuffer);

        const downsampledBuffer = new Uint8Array(width * height);
        const blockWidth = width / nativeWidth;
        const blockHeight = height / nativeHeight;

        for (let y = 0; y < nativeHeight; y++) {
            for (let x = 0; x < nativeWidth; x++) {
                let r = 0, g = 0, b = 0;
                let brightness = 0;
                let count = 0;

                for (let by = 0; by < blockHeight; by++) {
                    for (let bx = 0; bx < blockWidth; bx++) {
                        const px = Math.floor(x * blockWidth + bx);
                        const py = Math.floor(y * blockHeight + by);
                        const index = (py * width + px) * 4;
                        r += pixelBuffer[index];
                        g += pixelBuffer[index + 1];
                        b += pixelBuffer[index + 2];
                        count++;
                    }
                }
                brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                const index = (y * width + x);
                downsampledBuffer[index] = brightness / count;
            }
        }
        this.pixelBuffer = downsampledBuffer;
    }

    getPixelBuffer = () => {
        return this.pixelBuffer;
    }

    getBrightness = () => {
        let averageBrightness = 0;
        for (let i = 0; i < this.pixelBuffer.length; i++) {
            averageBrightness += this.pixelBuffer[i];
        }
        averageBrightness /= this.pixelBuffer.length;
        const gamma = 2.2;
        return Math.pow(averageBrightness / 255, 1 / gamma);
    }

}