// Written soon after getting the solution using brute force.
// I knew there had to be a better way but got stuck in one way of thinking,
// then after getting it via brute force looked at others' solutions.
//
// I based my rewritten solution on this: https://i.imgur.com/hZ4FJ4e.png

import { Solution } from './solution.js';
import { readLines } from './common.js';

// Finds the common segments in two patterns
function patternIntersection(p1: string, p2: string): string {
    return p1.split('').filter(c => p2.includes(c)).join('');
}

// Put a pattern in alphabetical order
function normalizePattern(pattern: string): string {
    return pattern.split('').sort().join('');
}

function segmentMapFromPatterns(patterns: string[]): Record<string, number> {
    let segmentMap: Record<string, number> = {};

    patterns = patterns.map(p => normalizePattern(p));

    // The other cases depend on these, so loop through once to ensure they're in place
    // prior to getting to any 5-segment or 6-segment digits
    for (let pattern of patterns) {
        if (pattern.length == 2) { segmentMap[pattern] = 1; continue; }
        else if (pattern.length == 3) { segmentMap[pattern] = 7; continue; }
        else if (pattern.length == 4) { segmentMap[pattern] = 4; continue; }
        else if (pattern.length == 7) { segmentMap[pattern] = 8; continue; }
    }

    const patternForNumber = (n: number) => Object.keys(segmentMap).find(key => segmentMap[key] === n)

    let pattern7 = patternForNumber(7)!;
    let pattern4 = patternForNumber(4)!;

    for (let pattern of patterns) {
        if (pattern.length != 5 && pattern.length != 6)
            continue;
        else if (pattern.length == 5) {
            // 2, 3 or 5.
            // If the pattern contains the pattern for 7, the segment represents 3.
            // If not, but the pattern shares 3 segments with the pattern for 4, the segment represents 5.
            // Otherwise, it represents 2.
            if(patternIntersection(pattern, pattern7) == pattern7)
                segmentMap[pattern] = 3;
            else if (patternIntersection(pattern, pattern4).length == 3)
                segmentMap[pattern] = 5;
            else
                segmentMap[pattern] = 2;
        }
        else {
            // 0, 6 or 9.
            // If the pattern contains the pattern for 4, the segment represents 9.
            // If not, but the patterns contains the pattern for 7, the segment represents 0.
            // Otherwise, it represents 6.
            if (patternIntersection(pattern, pattern4) == pattern4)
                segmentMap[pattern] = 9;
            else if (patternIntersection(pattern, pattern7) == pattern7)
                segmentMap[pattern] = 0;
            else
                segmentMap[pattern] = 6;
        }
    }

    return segmentMap;
}

function segmentLookup(segmentMap: Record<string, number>, segments: string): number {
    return segmentMap[normalizePattern(segments)];
}

export class Day8_Rewrite implements Solution {
    answer() {
        readLines("data/day8.txt", (data) => {
            let patterns : string[][] = [];
            let outputValues : string[][] = [];
            let segmentMaps : Record<string, number>[] = [];

            for (let line of data) {
                let [pattern, output] = line.split(" | ");
                patterns.push(pattern.split(" "));
                outputValues.push(output.split(" "));
            }

            let simpleDigitCount = 0;
            for (let i = 0; i < patterns.length; i++) {
                segmentMaps[i] = segmentMapFromPatterns(patterns[i]);
                simpleDigitCount += outputValues[i].map(s => segmentLookup(segmentMaps[i], s))
                                                   .filter(digit => [1, 4, 7, 8].includes(digit))
                                                   .length;
            }

            console.log(`Day 8 Part 1: ${simpleDigitCount}`);

            let sum = 0;
            for (let i = 0; i < patterns.length; i++) {
                let outputDigits = outputValues[i].map(s => segmentLookup(segmentMaps[i], s));
                let outputValue = parseInt(outputDigits.reduce((prev, curr) => prev + curr, "")); // Feeling lazy
                sum += outputValue;
            }

            console.log(`Day 8 Part 2: ${sum}`);
        });
    }
}