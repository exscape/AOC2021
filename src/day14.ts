import { Solution } from './solution.js';
import { readFile } from './common.js';

class InsertionRule {
    match: string;
    insert: string;

    constructor(match: string, insert: string) {
        this.match = match;
        this.insert = insert;
    }
}

function applyRules(template: string, insertionRules: InsertionRule[]) {
    // Make a list of insertion points first, then insert changes.
    let insertionPoints: [number, string][] = [];
    for (let i = 0; i < template.length - 1; i++) {
        for (let rule of insertionRules) {
            if (template.slice(i, i+2) == rule.match)
                insertionPoints.push([i+1, rule.insert]);
        }
    }

    let lastIndex = insertionPoints[insertionPoints.length - 1][0];
    let output: string[] = [];

    let prevIndex = 0;
    for (let point of insertionPoints) {
        output.push(template.slice(prevIndex, point[0]));
        output.push(point[1]);
        prevIndex = point[0];
    }
    output.push(template.slice(lastIndex, template.length));

    return output.join('');
}

function frequencyMap(s: string) {
    let map: Record<string, number> = {};
    for (let i = 0; i < s.length; i++) {
        if (map[s[i]] == undefined)
            map[s[i]] = 1;
        else
            map[s[i]]++;
    }

    return map;
}

export class Day14 implements Solution {
    answer() {
        readFile("data/day14.txt", (data) => {
            let [template, insertionRulesData] = data.split("\r\n\r\n");
            let insertionRules = insertionRulesData.split(/\r?\n/).map(line => {
                let [match, insert] = line.split(" -> ");
                return new InsertionRule(match, insert);
            });

            let output = template;
            for (let i = 0; i < 10; i++) {
                output = applyRules(output, insertionRules);
            }

            let map = frequencyMap(output);
            let min = Math.min(...Object.values(map));
            let max = Math.max(...Object.values(map));
            console.log(`Day 14 Part 1: ${max - min}`);
        });
    }
}