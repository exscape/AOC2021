import { Solution } from './solution.js';
import { readFile } from './common.js';

function nonLazyRange(start: number, end: number): number[] {
    let result = [];
    for (let i = start; i < end; i++)
        result.push(i);
    return result;
}

class Day7 implements Solution {
    positions: number[] = [];

    fuelForFunction(func: (n: number) => number): number {
        let possibilities = nonLazyRange(0, this.positions.length).map(target =>
            this.positions.reduce((prev, curr) => prev + func(Math.abs(target - curr)), 0)
        );
        return Math.min(...possibilities);
    }

    answer() {
        readFile("data/day7.txt", (data) => {
            this.positions = data.split(",").map(s => parseInt(s));
            console.log("Day 6 Part 1: " + this.fuelForFunction(n => n));
            console.log("Day 6 Part 2: " + this.fuelForFunction(n => (n+1)*n / 2));
        });
    }
}

export { Day7 }