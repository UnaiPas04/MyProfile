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
        const velX = this.x - this.lastX;
        this.lastX = this.x;
        return velX;
    }
     getVelY(){
        const velY = this.y - this.lastY;
        this.lastY = this.y;
        return velY;
    }
}
