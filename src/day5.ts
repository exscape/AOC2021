import { Solution } from './solution.js';
import { readLines } from './common.js';

class Point {
    x: number;
    y: number;

    constructor(s: string) {
        [this.x, this.y] = s.split(",").map(n => parseInt(n));
    }
}

class Line {
    start: Point;
    end: Point;

    constructor(s: string) {
        [this.start, this.end] = s.split(" -> ").map(s => new Point(s));
    }

    isDiagonal(): boolean {
        return this.start.x != this.end.x && this.start.y != this.end.y;
    }

    // Enumerate all the points that lie on this line
    *points() {
        let x = this.start.x;
        let y = this.start.y;

        function advance(val: number, start: number, end: number) {
            if (end > start) return val + 1;
            else if (start > end) return val - 1;
            else return val;
        }

        while (x != this.end.x || y != this.end.y) {
            yield [x, y];
            x = advance(x, this.start.x, this.end.x);
            y = advance(y, this.start.y, this.end.y);
        }
        yield [this.end.x, this.end.y];
    }
}

const GRID_SIZE = 1000;

class Day5 implements Solution {
    allLines: Line[] = [];

    findOverlaps(considerDiagonals: boolean): number {
        let lines = considerDiagonals ? [...this.allLines] 
                                      : this.allLines.filter(line => !line.isDiagonal());
        let grid = Array(GRID_SIZE).fill(0).map(_ => Array(GRID_SIZE).fill(0));

        for (let line of lines) {
            for (let [x, y] of line.points()) {
                grid[y][x]++;
            }
        }

        return grid.flat().filter(entry => entry >= 2).length;
    }

    answer() {
        readLines("data/day5.txt", (data) => {
            this.allLines = data.map(s => new Line(s));
            console.log(`Day 5 Part 1: ${this.findOverlaps(false)}`);
            console.log(`Day 5 Part 2: ${this.findOverlaps(true)}`);
        });
    }
}

export { Day5 }