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

    addRow(row: number[]) {
        this.squares.push(row);
    }

    height() {
        return this.squares.length;
    }

    width() {
        return this.squares[0].length;
    }

    at(coord: Coordinate): number {
        return this.squares[coord.y][coord.x];
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
            let grid = new Grid();
            for (let line of data) {
                grid.addRow(line.split('').map(s => parseInt(s)));
            }

            let lowPoints = [];
            for (let y = 0; y < grid.height(); y++) {
                for (let x = 0; x < grid.width(); x++) {
                    let coord = new Coordinate(x, y);
                    if (grid.adjacents(coord).every(n => grid.at(coord) < n))
                        lowPoints.push(coord);
                }
            }

            let riskLevel = arraySum(lowPoints.map(coord => grid.at(coord))) + lowPoints.length;
            console.log(`Day 9 Part 1: ${riskLevel}`);
        });
    }
}

export { Day9 }