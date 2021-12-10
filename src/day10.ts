import { Solution } from './solution.js';
import { readLines, arraySum } from './common.js';

const openers = "(<{[".split('');
const pairs : Record<string, string> = {")": "(", ">": "<", "}": "{", "]": "["};
const syntaxErrorScores : Record<string, number> = {")": 3, ">": 25137, "}": 1197, "]": 57};
const completionScores : Record<string, number> = {")": 1, "]": 2, "}": 3, ">": 4};

function calculateState(s: string): [string[], number] {
    let state = [];
    for (let char of s.split('')) {
        if (openers.includes(char))
            state.push(char);
        else {
            if (state.pop() != pairs[char])
                return [state, syntaxErrorScores[char]]
        }
    }

    return [state, 0];
}

function lineCompletion(s: string): string {
    let [state, syntaxErrorScore] = calculateState(s);

    if (syntaxErrorScore !== 0)
        throw new Error("Entry has syntax error");

    let revPairs = Object.fromEntries(Object.entries(pairs).map(([k, v]) => [v, k]));
    return state.reverse()
         .map(c => revPairs[c])
         .join('');
}

function calculateSyntaxErrorScore(s: string): number {
    return calculateState(s)[1];
}

function calculateCompletionScore(s: string): number {
    let score = 0;
    for (let char of s.split('')) {
        score *= 5;
        score += completionScores[char];
    }
    return score;
}

class Day10 implements Solution {
    answer() {
        readLines("data/day10.txt", (lines) => {
            let syntaxErrorScores = lines.map(line => calculateSyntaxErrorScore(line));
            console.log(`Day 10 Part 1: ${arraySum(syntaxErrorScores)}`);

            let incompleteLines = lines.filter(line => calculateSyntaxErrorScore(line) === 0);
            let completions = incompleteLines.map(line => lineCompletion(line));
            let score = completions.map(line => calculateCompletionScore(line))
                                   .sort((a, b) => a - b)
                                   [Math.floor(completions.length / 2)];

            console.log(`Day 10 Part 2: ${score}`);
        });
    }
}

export { Day10 }