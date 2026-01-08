class MouseTracker {
    constructor() {
        this.x = 0.5;
        this.y = 0.5;
        this.lastX = this.x;
        this.lastY = this.y;
        
        document.addEventListener('mousemove', this.update.bind(this));
    }

    update(event) {
        this.lastX = this.x;
        this.lastY = this.y;
        this.x = event.clientX / window.innerWidth;
        this.y = event.clientY / window.innerHeight;
    }

    getCoords() {
        return { x: this.x, y: this.y };
    }
    getX()
    {
        return this.x;
    }
    getY()
    {
        return this.y;
    }
    getVelX(){
        return this.x - this.lastX;
    }
     getVelY(){
        return this.y - this.lastY;
    }
}
