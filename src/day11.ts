import { Solution } from './solution.js';
import { readLines } from './common.js';

class Square {
    energyLevel: number;
    flashed: boolean;

    constructor(value: number) {
        this.energyLevel = value;
        this.flashed = false;
    }
}

class Coordinate {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Grid {
    squares: Square[][];
    numFlashes = 0;
    stepNumber = 0;
    hasSynchronized = false;

    constructor(lines: string[]) {
        this.squares = [];

        for (let line of lines) {
            let row = line.trim()
                          .split('')
                          .map(s => new Square(parseInt(s)));
            this.squares.push(row);
        }
    }

    at = (coord: Coordinate) => this.squares[coord.y][coord.x];
    height = () => this.squares.length;
    width = () => this.squares[0].length;

    *coords() {
        for (let y = 0; y < this.height(); y++) {
            for (let x = 0; x < this.width(); x++) {
                yield new Coordinate(x, y);
            }
        }
    }

    adjacentCoordinates(coord: Coordinate, includeDiagonals?: boolean): Coordinate[] {
        includeDiagonals ??= true;
        const [x, y] = [coord.x, coord.y];
        let list = [new Coordinate(x, y-1), new Coordinate(x, y+1), new Coordinate(x-1, y), new Coordinate(x+1, y)];
        if (includeDiagonals)
            list.push(...[new Coordinate(x-1, y-1), new Coordinate(x+1, y-1), new Coordinate(x-1, y+1), new Coordinate(x+1, y+1)]);
        
        return list.filter(c => c.x >= 0 && c.y >= 0 && c.x < this.width() && c.y < this.height());
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
            let grid = new Grid(lines);

            while (!grid.hasSynchronized) {
                grid.step();
                if (grid.stepNumber == 100)
                    console.log(`Day 11 Part 1: ${grid.numFlashes}`);
            }
            console.log(`Day 11 Part 2: ${grid.stepNumber}`);
        });
    }
}