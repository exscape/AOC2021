import { Solution } from './solution.js';
import { arraySum, readLines } from './common.js';

function* slidingWindow(array: number[], windowSize: number) {
    for (let i = 0; i <= array.length - windowSize; i++) {
        yield array.slice(i, i + windowSize);
    }
}

class Day1 implements Solution {
    parseData(lines: string[]) {
        let numbers = lines.map(s => parseInt(s));

        for (let windowSize of [1, 3]) {
            let previous;
            let increases = 0;
            for (let window of slidingWindow(numbers, windowSize)) {
                let sum = arraySum(window);
                if (previous !== undefined && sum > previous) {
                    increases++;
                }
                previous = sum;
            }

            console.log(`Day 1, window size ${windowSize}: ${increases}`)
        }
    }

    answer() {
        readLines('data/day1.txt', (lines) => this.parseData(lines));
    }
}

export { Day1 };