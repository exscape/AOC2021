import { Solution } from './solution.js';
import { readLines } from './common.js';

function isBigCave(dest: string) {
    return dest.toUpperCase() == dest;
}

function firstSmallDuplicate(visited: string[]) {
    let smallVisitedCaves = visited.filter(x => x.toLowerCase() == x);
    return new Set(smallVisitedCaves).size == smallVisitedCaves.length;
}

type DestinationMap = Record<string, [string]>;

// Build a map of possible destinations from each position.
function buildDestinationMap(lines: string[]) {
    const insert = (destinationMap: DestinationMap, origin: string, dest: string) => {
        if (destinationMap[origin] === undefined)
            destinationMap[origin] = [dest];
        else
            destinationMap[origin].push(dest);
    };

    let destinations : DestinationMap = {};
    for (let line of lines) {
        let [origin, dest] = line.split("-");
        insert(destinations, origin, dest);
        if (origin != "start")
            insert(destinations, dest, origin);
    }

    return destinations;
}

function findPaths(destinations: DestinationMap, start: string, allowSmallDuplicates: boolean, visited: string[] = []) {
    let paths: string[][] = [];

    visited.push(start);

    if (start == "end") {
        paths.push(visited);
        return paths;
    }

    for (let dest of destinations[start]) {
        // Try every destination, except ones we've seen before -- unless they're "big" caves (capital letters).
        // For part 2, another exception is that ONE small cave is allowed to be visited twice.
        if (!visited.includes(dest) || isBigCave(dest) || (allowSmallDuplicates && firstSmallDuplicate(visited)))
            paths.push(...findPaths(destinations, dest, allowSmallDuplicates, [...visited]));
    }

    return paths;
}

export class Day12 implements Solution {
    answer() {
        readLines("data/day12.txt", (lines) => {
            let destinations = buildDestinationMap(lines);
            console.log(`Day 12 Part 1: ${findPaths(destinations, "start", false).length}`);
            console.log(`Day 12 Part 2: ${findPaths(destinations, "start", true).length}`);
        });
    }
}