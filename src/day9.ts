import { Solution } from './solution.js';
import { readLines, arraySum, Coordinate, GenericGrid } from './common.js';

class Grid extends GenericGrid<number> {
    initialize(lines: string[]) {
        for (let line of lines) {
            this.squares.push(line.split('').map(s => parseInt(s)));
        }

        return this;
    }

    // Basins are found by looking at each low point, and recursively moving outwards (up/down/left/right) until we hit a 9,
    // which is not counted as part of the basin. This means we will find points that are located diagonally from the low point,
    // but only after recursively moving e.g. down and then right.
    findLowerCoordinates(start: Coordinate): Coordinate[] {
        let found = [start];
        for (let adjacent of this.adjacentCoordinates(start, false)) {
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
            let grid = new Grid().initialize(data);
            let lowPoints = [...grid.coords()].filter(coord =>
                grid.adjacentSquares(coord, false).every(n => grid.at(coord) < n)
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