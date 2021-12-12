import { Solution } from './solution.js';
import { readLines } from './common.js';

// 10 paths for part 1, 36 for part 2
let example1 = `start-A
start-b
A-c
A-b
b-d
A-end
b-end`;

// 19 paths for part 1, 103 for part 2
let example2 = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

// 226 paths for part 1, 3509 for part 2
let example3 = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`;

type DestinationMap = Record<string, [string]>;

function isBigCave(dest: string) {
    return dest.toUpperCase() == dest;
}

function findPaths(destinations: DestinationMap, start: string, visited: string[] = [], depth : number = 0): string[][] {
    let paths: string[][] = [];

    visited.push(start);
//    console.log("  ".repeat(depth) + `findPaths, start=${start}, visited=${visited}, paths=${paths}; destinations from ${start}=${destinations[start]}`);

    if (start == "end") {
        paths.push(visited);
        return paths;
    }

    for (let dest of destinations[start]) {
        // Try every destination, except ones we've seen before -- unless they're "big" caves (capital letters).
        if (!visited.includes(dest) || isBigCave(dest))
            paths.push(...findPaths(destinations, dest, [...visited], depth + 1));
    }

    return paths;
}

export class Day12 implements Solution {
    answer() {
        readLines("data/day12.txt", (lines) => {

            const insert = (dest: DestinationMap, a: string, b: string) => {
                if (dest[a] === undefined)
                    dest[a] = [b];
                else
                    dest[a].push(b);
            };

            // Build a tree of possible destinations.
            // For example: start-A, A-B, end-B => start leads to A, A leads to start and B, B leads to A and end
            let destinations : DestinationMap = {};
            for (let line of lines) {//example3.split("\n").map(s => s.trim())) {
                let [a, b] = line.split("-");
                insert(destinations, a, b);
                insert(destinations, b, a);
            }
            console.log(destinations);

            let paths = findPaths(destinations, "start");
//            console.log(paths);
            console.log(`${paths.length} paths found`)
        });
    }
}