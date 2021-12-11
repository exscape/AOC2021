import { Solution } from './solution.js';
import { readLines, GenericGrid, Coordinate } from './common.js';

class Square {
    energyLevel: number;
    flashed: boolean;

    constructor(value: number) {
        this.energyLevel = value;
        this.flashed = false;
    }
}

class Grid extends GenericGrid<Square> {
    numFlashes = 0;
    stepNumber = 0;
    hasSynchronized = false;

    initialize(lines: string[]): Grid {
        this.squares = [];

        for (let line of lines) {
            let row = line.trim()
                          .split('')
                          .map(s => new Square(parseInt(s)));
            this.squares.push(row);
        }

        return this;
    }

    flash(coord: Coordinate) {
        this.at(coord).flashed = true;
        this.numFlashes++;

        for (let adjacent of this.adjacentCoordinates(coord, true)) {
            this.at(adjacent).energyLevel++;
        }
    }

    step() {
        // Increase the energy level of each octopus
        for (let coord of this.coords()) {
            this.at(coord).energyLevel++;
        }

        // Check where flashes are needed, perform, and repeat until there are no more
        let oldFlashCount;
        do {
            oldFlashCount = this.numFlashes;
            for (let coord of this.coords()) {
                if (this.at(coord).energyLevel > 9 && this.at(coord).flashed == false)
                    this.flash(coord);
            }
        } while(this.numFlashes > oldFlashCount);

        this.hasSynchronized = this.squares.flat().every(sq => sq.flashed);

        // Reset for next step
        for (let coord of this.coords()) {
            if (this.at(coord).flashed)
                this.at(coord).energyLevel = 0;

            this.at(coord).flashed = false;
        }

        this.stepNumber++;
    }
}

export class Day11 implements Solution {
    answer() {
        readLines("data/day11.txt", (lines) => {
            let grid = new Grid().initialize(lines);

            while (!grid.hasSynchronized) {
                grid.step();
                if (grid.stepNumber == 100)
                    console.log(`Day 11 Part 1: ${grid.numFlashes}`);
            }
            console.log(`Day 11 Part 2: ${grid.stepNumber}`);
        });
    }
}