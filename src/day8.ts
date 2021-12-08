import { Solution } from './solution.js';
import { readLines } from './common.js';

export class Day8 implements Solution {
    // For a given segment count, which digits could be the one supposed to be displayed?
    segmentCountToDigits(count: number): number[] {
        switch(count) {
            case 2:
                return [1];
            case 3:
                return [7];
            case 4:
                return [4];
            case 5:
                return [2, 3, 5]
            case 6:
                return [0, 6, 9];
            case 7:
                return [8];
            default:
                throw new Error("Invalid count");
        }
    }

    answer() {
        readLines("data/day8.txt", (data) => {
            let patterns : string[][] = [];
            let outputValues : string[][] = [];
            for (let line of data) {
                let [pattern, output] = line.split(" | ");
                patterns.push(pattern.split(" "));
                outputValues.push(output.split(" "));
            }

            let part1 = outputValues
                        .flat()
                        .map(s => this.segmentCountToDigits(s.length)[0])
                        .filter(digit => [1, 4, 7, 8].includes(digit))
                        .length;

            console.log(`Day 8 Part 1: ${part1}`);
        });
    }
}