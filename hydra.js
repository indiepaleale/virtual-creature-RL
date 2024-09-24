import HydraRenderer from "hydra-synth";
import { robotCanvas } from "./second-camera";

const hydraCanvas = document.createElement("CANVAS");

document.body.appendChild(hydraCanvas);
hydraCanvas.style.width = `${window.innerHeight / 3}px`; // Smaller width for the pop-up window
hydraCanvas.style.height = `${window.innerHeight / 4}px`; // Smaller height for the pop-up window
hydraCanvas.style.position = 'absolute';
hydraCanvas.style.bottom = '10px';
hydraCanvas.style.left = '10px';




const opts = {
    canvas: hydraCanvas, // canvas element to render to. If none is supplied, a canvas will be created and appended to the screen
    autoLoop: true, // whether or not to automatically call requestAnimationFrame
    detectAudio: false, // whether or not to automatically
    makeGlobal: false, // if false, will not pollute global namespace (note: there are currently bugs with this)
};

const hydra = new HydraRenderer(opts).synth;

hydra.s0.init({ src: robotCanvas });

hydra.src(hydra.s0)
    .modulate(hydra.o0, .2)
    .out(hydra.o0);

export default hydra;