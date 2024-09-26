const controls = {
    mouseX: 0,
    mouseY: 0,
    
    init() {
        window.addEventListener('mousemove', (event) => {
            const { innerWidth, innerHeight } = window;
            this.mouseX = (event.clientX / innerWidth) * 2 - 1;
            this.mouseY = (event.clientY / innerHeight) * 2 - 1;
        });
        window.addEventListener('click', () => {
            console.log(this.mouseX, this.mouseY);
        });
    }
};

// Call the init method on the controls object
controls.init();

export default controls;