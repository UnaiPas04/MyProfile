class RandomGenerator {
    constructor(seed) {
        this.seed = seed;
    }
    
    // Número entre 0 y 1
    next() {
        this.seed |= 0;
        this.seed = (this.seed + 0x9e3779b9) | 0;
        let t = this.seed ^ (this.seed >>> 16);
        t = Math.imul(t, 0x21f0aaad);
        t = t ^ (t >>> 15);
        t = Math.imul(t, 0x735a2d97);
        return ((t = t ^ (t >>> 15)) >>> 0) / 4294967296;
    }

    // Devuelve un índice aleatorio según un array de pesos
    selectIndex(weights) {
        let total = 0;
        for (let w of weights) total += w;
        if (total === 0) return -1; // no hay candidatos viables
        
        let r = this.next() * total;
        let acum = 0;
        for (let i = 0; i < weights.length; i++) {
            acum += weights[i];
            if (r < acum) return i;
        }
        return weights.length - 1; // seguro
    }
}