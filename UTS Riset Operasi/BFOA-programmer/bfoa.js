class Bacteria {
    constructor(nDimensi, objFunction) {
        this.nDimensi = nDimensi;
        this.objFunction = objFunction;
        this.position = Array(nDimensi).fill(0);
        this.fitness = 0;
    }

    initialize(min, max) {
        for (let i = 0; i < this.nDimensi; i++) {
            this.position[i] = Math.floor(Math.random() * (max - min + 1) + min);
        }
        this.calculateFitness();
    }

    calculateFitness() {
        this.fitness = this.objFunction(...this.position);
    }

    move(stepSize, min, max) {
        for (let i = 0; i < this.nDimensi; i++) {
            this.position[i] += stepSize * (Math.random() * 2 - 1);
            this.position[i] = Math.min(max, Math.max(min, Math.floor(this.position[i])));
        }
        this.calculateFitness();
    }
}

class BFOA {
    constructor(nBacteria, nDimensi, objFunction) {
        this.nBacteria = nBacteria;
        this.nDimensi = nDimensi;
        this.objFunction = objFunction;
        this.bacteria = [];
        this.bestFitness = -Infinity;
        this.bestPosition = [];
        this.stepSize = 1;

        this.initializeBacteria();
    }

    initializeBacteria() {
        for (let i = 0; i < this.nBacteria; i++) {
            const bacterium = new Bacteria(this.nDimensi, this.objFunction);
            bacterium.initialize(0, 20);
            this.bacteria.push(bacterium);
        }
    }

    chemotaxis() {
        this.bacteria.forEach(bacterium => bacterium.move(this.stepSize, 0, 20));
    }

    reproduction() {
        this.bacteria.sort((a, b) => b.fitness - a.fitness);
        const half = Math.floor(this.bacteria.length / 2);
        for (let i = half; i < this.bacteria.length; i++) {
            this.bacteria[i] = new Bacteria(this.nDimensi, this.objFunction);
            this.bacteria[i].initialize(0, 20);
        }
    }

    updateBest() {
        this.bacteria.forEach(bacterium => {
            if (bacterium.fitness > this.bestFitness) {
                this.bestFitness = bacterium.fitness;
                this.bestPosition = [...bacterium.position];
            }
        });
    }

    mainBFOA() {
        this.chemotaxis();
        this.updateBest();
        this.reproduction();
    }
}

export { BFOA };
