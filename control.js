const controls = {
    controlX: 0,
    controlY: 0,
    
    init() {
        window.addEventListener('mousemove', (event) => {
            const { innerWidth, innerHeight } = window;
            this.controlX = (event.clientX / innerWidth) * 2 - 1;
            this.controlY = (event.clientY / innerHeight) * 2 - 1;
        });
        window.addEventListener('click', () => {
            console.log(this.controlX, this.controlY);
        });
    }
};

// Call the init method on the controls object
controls.init();
console.log('control.js loaded');

export default controls;