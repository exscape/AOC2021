import { Solution } from './solution.js';
import { readLines, GenericGrid, Coordinate } from './common.js';

import Heapify from './heapify.cjs';

function expandGrid(originalGrid: Grid) {
    // Repeat the grid 5 times in each direction, increasing every risk value by 1 for each step to the right OR down.
    // Values loop back 9 -> 1 (not to 0!).
    let gridData: string[] = [];

    const mapFunc = (n: number, x: number, y: number) => {
        let newValue = n + x + y;
        if (newValue > 9)
            newValue = newValue % 10 + 1;
        return newValue;
    }
    let originalRows = [...originalGrid.rows()];

    for (let y = 0; y < originalGrid.height() * 5; y++) {
        let row: number[] = [];
        for (let x = 0; x < 5; x++)
            row = row.concat(originalRows[y % originalGrid.height()].map(n => mapFunc(n, x, Math.floor(y / originalGrid.height()))));
        gridData.push(row.join(''));
    }

    return new Grid().initialize(gridData);
}

class Grid extends GenericGrid<number> {
    initialize(lines: string[]) {
        this._squares.push(...lines.map(line => line.split('').map(s => parseInt(s))));
        return this
    }

    shortestPathCost(start: Coordinate, end: Coordinate) {
        // Uses Dijkstra's algorithm.
        // Strings are used in the Map instead of Coordinates because of strict equality checks in Maps.

        let distances: Map<string, number> = new Map();

        const d = (vertex: Coordinate) => distances.get(vertex.s())!
        const d_set = (vertex: Coordinate, distance: number) => distances.set(vertex.s(), distance)
        const weight = (vertex: Coordinate) => this.at(vertex)

        let Q = new Heapify(this.height() * this.width() * 20);

        let unvisited: Set<string> = new Set();

        // Initialize
        for (let coord of this.coords()) {
            d_set(coord, Number.POSITIVE_INFINITY);
            unvisited.add(coord.s());
        }
        d_set(start, 0);
        Q.push(start.n(), 0);

        while (unvisited.size > 0) {
            let currentCost = Q.peekPriority();
            let num = Q.pop()!;

            // Hack required as the heap can only store numbers, so we combine x/y to a 32-bit int
            let v = new Coordinate(num & 0xffff, (num & 0xffff0000) >> 16);

            if (!unvisited.has(v.s()))
                continue;

            unvisited.delete(v.s());

            for (let u of this.adjacentCoordinates(v, false)) {
                if (currentCost + weight(u) < d(u))
                    d_set(u, currentCost + weight(u));

                Q.push(u.n(), currentCost + weight(u));
            }

        }

        return distances.get(end.s());
    }
}

export class Day15 implements Solution {
    answer() {
        readLines("data/day15.txt", (lines) => {
            let grid = new Grid().initialize(lines);

            let cost = grid.shortestPathCost(new Coordinate(0, 0), new Coordinate(grid.width() - 1, grid.height() - 1));
            console.log(`Day 15 Part 1: ${cost}`);

            let biggerGrid = expandGrid(grid);
            let biggerGridCost = biggerGrid.shortestPathCost(new Coordinate(0, 0), new Coordinate(biggerGrid.width() - 1, biggerGrid.height() - 1));
            console.log(`Day 15 Part 2: ${biggerGridCost}`);
        });
    }
}