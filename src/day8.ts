import { Solution } from './solution.js';
import { Perf, readLines } from './common.js';

import { Permutation } from 'js-combinatorics';

const SEGMENT_MAP : Record<string, number> = {
     "abcefg": 0, "cf": 1, "acdeg": 2, "acdfg": 3, "bcdf": 4,
     "abdfg": 5, "abdefg": 6, "acf": 7, "abcdefg": 8, "abcdfg": 9
};

 class Digit {
     segments: string;
     constructor(segments: string) {
         this.segments = segments.split('').sort().join('');
     }

    // Map from invalid segments (e.g. dgb) to valid (e.g. acf, for 7)
    remap(conversionTable: Record<string, string>): Digit {
        this.segments = this.segments.split('')
                                     .map(c => conversionTable[c])
                                     .sort()
                                     .join('');
        return this;
    }

    // If these (actual) segments are lit, what digit is displayed?
    value(): number {
        return SEGMENT_MAP[this.segments];
    }
 }

export class Day8 implements Solution {
    ALL_PERMUTATIONS = new Permutation("abcdefg");

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

    // I'm not at ALL happy with brute forcing, but I've spent two days and the problem hasn't clicked.
    // I expected to be able to solve one case manually and develop an algorithm, but no such luck.
    // Now that I have the correct answer I'll probably look at other solutions to see what I missed.
    calculateSegmentMap(patterns: string[]): Record<string, string> {
        const isValid = (mapping: Record<string, string>) =>
            patterns.map(p => new Digit(p).remap(mapping).value() !== undefined).every(v => v);

        for (let p of this.ALL_PERMUTATIONS) {
            let mapping : Record<string, string> = {a: p[0], b: p[1], c: p[2], d: p[3], e: p[4], f: p[5], g: p[6]};
            if (isValid(mapping))
                return mapping;
        }

        return {};
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

            let simpleDigitCount = outputValues
                        .flat()
                        .map(s => this.segmentCountToDigits(s.length)[0])
                        .filter(digit => [1, 4, 7, 8].includes(digit))
                        .length;

            console.log(`Day 8 Part 1: ${simpleDigitCount}`);

            let sum = 0;
            for (let i = 0; i < patterns.length; i++) {
                let mapping = this.calculateSegmentMap(patterns[i]);
                let outputDigits = outputValues[i].map(s => new Digit(s).remap(mapping).value());
                let outputValue = parseInt(outputDigits.reduce((prev, curr) => prev + curr, "")); // Feeling lazy
                sum += outputValue;
            }

            console.log(`Day 8 Part 2: ${sum}`);
        });
    }
}