import { Solution } from './solution.js';
import { readLines, arraySum } from './common.js';

class Coordinate {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Grid {
    squares: number[][] = [];

    constructor(lines: string[]) {
        for (let line of lines) {
            this.squares.push(line.split('').map(s => parseInt(s)));
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

    adjacents(coord: Coordinate): number[] {
        const x = coord.x;
        const y = coord.y;
        return [this.squares[y-1]?.[x], this.squares[y+1]?.[x], this.squares[y]?.[x-1], this.squares[y]?.[x+1]]
               .filter(sq => sq != undefined);
    }
}

class Day9 implements Solution {
    answer() {
        readLines("data/day9.txt", (data) => {
            let grid = new Grid(data);
            let lowPoints = [...grid.coords()].filter(coord =>
                grid.adjacents(coord).every(n => grid.at(coord) < n)
            );

            let riskLevel = arraySum(lowPoints.map(coord => grid.at(coord))) + lowPoints.length;
            console.log(`Day 9 Part 1: ${riskLevel}`);
        });
    }
}

export { Day9 }