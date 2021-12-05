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

    // Enumerate all the points that lie on this line
    *points() {
        if (this.start.x == this.end.x) {
             // Vertical line
             let [low, high] = [Math.min(this.start.y, this.end.y), Math.max(this.start.y, this.end.y)];
             for (let y = low; y <= high; y++) {
                yield [this.start.x, y];
             }
        }
        else if (this.start.y == this.end.y) {
             // Horizontal line
             let [low, high] = [Math.min(this.start.x, this.end.x), Math.max(this.start.x, this.end.x)];
             for (let x = low; x <= high; x++) {
                yield [x, this.start.y];
             }
        }
        else
            throw new Error("Diagonals not supported yet");
    }
}

class Day5 implements Solution {
    answer() {
        readLines("data/day5.txt", (data) => {
            let lines = data.map(s => new Line(s));
            let horVertLines = lines.filter(line => line.start.x == line.end.x || line.start.y == line.end.y);
            console.log(horVertLines);

            // Ugly but easy: assume all coordinates are <= 999, which is the case for my data set
            let grid = Array(1000).fill(0).map(e => Array(1000).fill(0));

            // "Draw" the lines in the grid
            for (let line of horVertLines) {
                for (let [x, y] of line.points()) {
                    grid[y][x]++;
                }
            }

            let total_overlaps = 0;
            for (let y = 0; y < 1000; y++) {
                for (let x = 0; x < 1000; x++) {
                    if (grid[y][x] >= 2)
                        total_overlaps++;
                }
            }

            console.log(`Day 5 Part 1: ${total_overlaps}`)
        });
    }
}

export { Day5 }