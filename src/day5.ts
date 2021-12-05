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
        else {
            // Number of steps along x = number of steps along y, since all diagonals are along 45 degree angles
            let steps = Math.abs(this.start.x - this.end.x) + 1;

            // Draw all lines top-to-bottom (y increasing). x may either increase (top left -> bottom right) or decrease (top right -> bottom left).
            let x_dir = this.end.x > this.start.x; // Is x increasing?
            let y_dir = this.end.y > this.start.y; // Is y increasing?
            for (let i = 0, x = this.start.x, y = this.start.y; i < steps; i++, (x_dir ? x++ : x--), (y_dir ? y++ : y--)) {
                yield [x, y];
            }
        }
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

        let total_overlaps = 0;
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] >= 2)
                    total_overlaps++;
            }
        }

        return total_overlaps;
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