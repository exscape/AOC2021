import { Solution } from './solution.js';
import { readFile } from './common.js';

// Calculate [width, height] of the paper
function calculateDimensions(points: number[][]) {
    return points.reduce((prev, curr) => [Math.max(prev[0], curr[0]), Math.max(prev[1], curr[1])], [0, 0])
                 .map(d => d + 1);
}

function unique(list: number[][]): number[][] {
    return [...new Map(list.map(v => [JSON.stringify(v), v])).values()];
}

function performFold(fold: (string | number)[], points: number[][]) {
    let [foldDirection, foldLocation] = fold as [string, number];
    if (foldDirection == "x")
        return unique(points.map(p => p[0] > foldLocation ? [foldLocation - Math.abs(p[0] - foldLocation), p[1]] : p)
                            .filter(p => p[0] < foldLocation));
    else
        return unique(points.map(p => p[1] > foldLocation ? [p[0], foldLocation - Math.abs(p[1] - foldLocation)] : p)
                            .filter(p => p[1] < foldLocation));
}

export class Day13 implements Solution {
    answer() {
        readFile("data/day13.txt", (data) => {
            let [pointData, foldData] = data.split("\r\n\r\n"); // TODO: why doesn't /(\r?\n){2}/ work?
            let points = pointData.split(/\r?\n/).map(line => line.split(",").map(s => parseInt(s)));
            let folds = [...foldData.matchAll(/fold along ([xy])=(\d+)/g)].map(m => [m[1], parseInt(m[2])]);

            // Part 1
            let [firstFold, ...rest] = folds;
            points = performFold(firstFold, points);
            console.log(`Day 13 Part 1: ${points.length}`);

            // Part 2
            for (let fold of rest) {
                points = performFold(fold, points);
            }

            let dimensions = calculateDimensions(points);

            let output : string[][] = Array(dimensions[1]).fill(" ").map(_ => Array(dimensions[0]).fill(" "));
            for (let p of points)
                output[p[1]][p[0]] = "#";

            console.log("Day 13 Part 2:");
            for (let line of output)
                console.log(line.join(''));
        });
    }
}