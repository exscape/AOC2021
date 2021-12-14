import { Solution } from './solution.js';
import { readFile } from './common.js';

function addToCount(map: Map<string, number>, key: string, amount: number) {
    if (map.get(key) == undefined) map.set(key, amount);
    else map.set(key, map.get(key)! + amount);
}

function createPolymer(iterations: number, state: Map<string, number>, insertionRules: Map<string, string>, letterCountMap: Map<string, number>) {
    for (let i = 0; i < iterations; i++) {
        let newState: Map<string, number> = new Map(state);
        for (let [pair, count] of state.entries()) {
            const char = insertionRules.get(pair);
            const [left, right] = [pair[0] + char, char + pair[1]];

            addToCount(letterCountMap, char!, count);
            addToCount(newState, left, count);
            addToCount(newState, right, count);
            addToCount(newState, pair, -count)
        }
        state = newState;
    }

    return letterCountMap;
}

function generatePairs(template: string) {
    let pairs: Map<string, number> = new Map();
    for (let i = 0; i < template.length - 1; i++) {
        addToCount(pairs, template.slice(i, i+2), 1);
    }

    return pairs;
}

export class Day14 implements Solution {
    answer() {
        readFile("data/day14.txt", (data) => {
            const [template, insertionRulesData] = data.split("\r\n\r\n");

            const insertionRules = new Map(
                insertionRulesData.split(/\r?\n/).map(line => {
                    const [match, insert] = line.split(" -> ");
                    return [match, insert]
                })
            );

            const initialState = generatePairs(template);

            const initialLetterCountMap: Map<string, number> = new Map();
            template.split('').forEach(letter => addToCount(initialLetterCountMap, letter, 1));

            // Part 1
            let letterCountMap = createPolymer(10, initialState, insertionRules, new Map(initialLetterCountMap));
            let values = [...letterCountMap.values()].sort((a,b) => b-a);
            console.log(`Day 14 Part 1: ${values[0] - values[values.length - 1]}`);

            // Part 2
            letterCountMap = createPolymer(40, initialState, insertionRules, new Map(initialLetterCountMap));
            values = [...letterCountMap.values()].sort((a,b) => b-a);
            console.log(`Day 14 Part 2: ${values[0] - values[values.length - 1]}`);
        });
    }
}