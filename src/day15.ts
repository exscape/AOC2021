import { Solution } from './solution.js';
import { readLines, GenericGrid, Coordinate, arraySum } from './common.js';
//import FastPriorityQueue = require('fastpriorityqueue');

function minimumDistanceNode(distances: Map<string, number>, visited: Set<string>) {
    // Ugh! Needs work. FastPriorityQueue didn't seem to work well with the changing distance function.
    // Find the *unvisited* node with the lowest distance score.
    let least_distance = Number.POSITIVE_INFINITY;
    let least_vertex: string;
    for (let [vertex, distance] of distances.entries()) {
        if (distance < least_distance && !visited.has(vertex)) {
            least_distance = distance;
            least_vertex = vertex;
        }
    }

    let [x,y] = least_vertex!.split(',').map(s => parseInt(s));
    return new Coordinate(x,y);
}

class Grid extends GenericGrid<number> {
    initialize(lines: string[]) {
        this._squares.push(...lines.map(line => line.split('').map(s => parseInt(s))));
        return this
    }

    DEBUG_PRINT(highlightSquares?: Coordinate[]) {
        highlightSquares ??= [];
        for (let y = 0; y < this.height(); y++) {
            for (let x = 0; x < this.width(); x++) {
                let highlight = highlightSquares.some(sq => sq.x == x && sq.y == y);
                if (highlight)
                    process.stdout.write("\u001b[92m");
                process.stdout.write(this._squares[y][x] + "");
                if (highlight)
                    process.stdout.write("\u001b[0m");
            }
            process.stdout.write("\n");
        }
    }

    shortestPathCost(start: Coordinate, end: Coordinate) {
        // Uses Dijkstra's algorithm.
        // Strings are used in the Map instead of Coordinates because of strict equality checks in Maps.

        let distances: Map<string, number> = new Map();

        const d = (vertex: Coordinate) => distances.get(vertex.s())!
        const d_set = (vertex: Coordinate, distance: number) => distances.set(vertex.s(), distance)
        const weight = (vertex: Coordinate) => this.at(vertex)

//        let Q = new FastPriorityQueue((a: Coordinate, b: Coordinate) => d(a) < d(b));

        let visited: Set<string> = new Set();

        // Initialize
        for (let coord of this.coords()) {
            d_set(coord, 1000000);//Number.POSITIVE_INFINITY);
//            Q.add(coord);
        }
        d_set(start, 0);

        while (visited.size != this.height() * this.width()) {
//            let v = Q.poll()!;
            let v = minimumDistanceNode(distances, visited);
            visited.add(v.s());
            for (let u of this.adjacentCoordinates(v, false)) {
                if (visited.has(u.s()))
                    continue;

                if (d(v) + weight(u) < d(u))
                    d_set(u, d(v) + weight(u));
            }
        }

        return distances.get(end.s());
    }

    pathScore(path: Coordinate[]) {
        return arraySum(path.slice(1).map(coord => this.at(coord)));
    }
}

export class Day15 implements Solution {
    answer() {
        readLines("data/day15.txt", (lines) => {
            let grid = new Grid().initialize(lines);

            let cost = grid.shortestPathCost(new Coordinate(0, 0), new Coordinate(grid.width() - 1, grid.height() - 1));
            console.log(`Day 15 Part 1: ${cost}`);
        });
    }
}