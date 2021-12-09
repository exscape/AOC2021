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

    adjacentValues(coord: Coordinate): number[] {
        return this.adjacentCoordinates(coord).map(coord => this.at(coord));
    }

    adjacentCoordinates(coord: Coordinate): Coordinate[] {
        const x = coord.x;
        const y = coord.y;
        return [new Coordinate(x, y-1), new Coordinate(x, y+1), new Coordinate(x-1, y), new Coordinate(x+1, y)]
               .filter(c => c.x >= 0 && c.y >= 0 && c.x < this.width() && c.y < this.height());
    }

    // Basins are found by looking at each low point, and recursively moving outwards (up/down/left/right) until we hit a 9,
    // which is not counted as part of the basin. This means we will find points that are located diagonally from the low point,
    // but only after recursively moving e.g. down and then right.
    findLowerCoordinates(start: Coordinate): Coordinate[] {
        let found = [start];
        for (let adjacent of this.adjacentCoordinates(start)) {
            if (this.at(adjacent) != 9 && this.at(adjacent) > this.at(start)) {
                found.push(adjacent);
                found.push(...this.findLowerCoordinates(adjacent));
            }
        }

        return found;
    }
}

// Ugh. Set() only compares by reference (===) so it doesn't help us. This does.
function unique(list: Coordinate[]): Coordinate[] {
    return [...new Map(list.map(v => [JSON.stringify([v.x,v.y]), v])).values()];
}

class Day9 implements Solution {
    answer() {
        readLines("data/day9.txt", (data) => {
            let grid = new Grid(data);
            let lowPoints = [...grid.coords()].filter(coord =>
                grid.adjacentValues(coord).every(n => grid.at(coord) < n)
            );

            let riskLevel = arraySum(lowPoints.map(coord => grid.at(coord))) + lowPoints.length;
            console.log(`Day 9 Part 1: ${riskLevel}`);

            let basins = [];
            for (let lowPoint of lowPoints) {
                // This is hardly optimal, but it'll have to do.
                let basinCoordinates = unique(grid.findLowerCoordinates(lowPoint));
                basins.push(basinCoordinates.length);
            }
            basins.sort((a, b) => b - a);
            let basinProduct = basins.slice(0, 3)
                                     .reduce((a, b) => a * b, 1);
            console.log(`Day 9 Part 2: ${basinProduct}`);
        });
    }
}

export { Day9 }