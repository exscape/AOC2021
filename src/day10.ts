import { Solution } from './solution.js';
import { readLines, arraySum } from './common.js';

const openers = "(<{[".split('');
const pairs : Record<string, string> = {")": "(", ">": "<", "}": "{", "]": "["};
const scores : Record<string, number> = {")": 3, ">": 25137, "}": 1197, "]": 57};

function firstInvalidCharacterScore(s: string): number {
    let state = [];

    for (let char of s.split('')) {
        if (openers.includes(char))
            state.push(char);
        else {
            if (state.pop() != pairs[char])
                return scores[char];
        }
    }

    return 0;
}

class Day10 implements Solution {
    answer() {
        readLines("data/day10.txt", (lines) => {
            let scores = lines.map(line => firstInvalidCharacterScore(line));
            console.log(`Day 10 Part 1: ${arraySum(scores)}`);
        });
    }
}

export { Day10 }