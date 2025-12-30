class MouseTracker {
    constructor() {
        this.x = 0;
        this.y = 0;
        
        document.addEventListener('mousemove', this.update.bind(this));
    }

    update(event) {
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
}
