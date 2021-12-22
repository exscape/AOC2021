import { Solution } from './solution.js';
import { readLines, Perf } from './common.js';

// Part 1 only. Overengineered for the hell of it, yet still slow and ugly.
//
// I realized this won't work for part 2 long before I started coding,
// but figured I'd get at least part 1 done, regardless.
// Not sure if I'll bother trying to solve part 2 as well,
// as I don't have an idea for how to solve it yet.

class Range {
    start: number;
    end: number;

    constructor(nums: number[]) {
        this.start = nums[0];
        this.end = nums[1];
    }

    addOffset(offset: number) {
        this.start += offset;
        this.end += offset;
    }
}

enum PowerStatus {
    Off = 0,
    On = 1
}

class Instruction {
    powerStatus: PowerStatus;
    x: Range;
    y: Range;
    z: Range;

    constructor(line: string) {
        let matches = Array.from(line.matchAll(/(on|off)|(-?\d+)/g)).map(m => m[0]);
        this.powerStatus = matches.shift() == "on" ? PowerStatus.On : PowerStatus.Off;
        let coords = matches.map(s => parseInt(s));
        this.x = new Range(coords.slice(0, 2));
        this.y = new Range(coords.slice(2, 4));
        this.z = new Range(coords.slice(4, 6));
    }

    remap(xOffset: number, yOffset: number, zOffset: number) {
        this.x.addOffset(xOffset);
        this.y.addOffset(yOffset);
        this.z.addOffset(zOffset);
    }

    isInsideInitArea() {
        return [this.x, this.y, this.z].every(c => Math.abs(c.start) < 50 || Math.abs(c.end) < 50)
    }
}

class Grid3D {
    cubes: boolean[][][];

    constructor(x: number, y: number, z: number) {
        this.cubes = Array(x).fill(false).map(_ => Array(y).fill(false).map(_ => Array(z).fill(false)));
    }

    executeInstruction(instr: Instruction) {
        for (let x = instr.x.start; x <= instr.x.end; x++) {
            for (let y = instr.y.start; y <= instr.y.end; y++) {
                for (let z = instr.z.start; z <= instr.z.end; z++) {
                    this.cubes[x][y][z] = instr.powerStatus == PowerStatus.On;
                }
            }
        }
    }

    onCount() {
        // This is so horrible performance-wise, but soo much shorter than the nested loops
        return this.cubes.flat(2).filter(c => c).length;
    }
}

export class Day22 implements Solution {
    answer() {
        readLines("data/day22.txt", (lines) => {
            let perf = new Perf();
            let instructions = lines.map(line => new Instruction(line))
                                    .filter(i => i.isInsideInitArea());

            // I'm not sure which is worse: this, or looping through many times with "clean" but still repeated code.
            let minX = Number.MAX_VALUE, minY = Number.MAX_VALUE, minZ = Number.MAX_VALUE;
            let maxX = Number.MIN_VALUE, maxY = Number.MIN_VALUE, maxZ = Number.MIN_VALUE;
            for (let instr of instructions) {
                if (instr.x.start < minX) minX = instr.x.start;
                if (instr.y.start < minY) minY = instr.y.start;
                if (instr.z.start < minZ) minZ = instr.z.start;
                if (instr.x.end > maxX) maxX = instr.x.end;
                if (instr.y.end > maxY) maxY = instr.y.end;
                if (instr.z.end > maxZ) maxZ = instr.z.end;
            }

            instructions.forEach(i => i.remap(-minX, -minY, -minZ));

            let grid = new Grid3D(maxX - minX + 1, maxY - minY + 1, maxZ - minZ + 1);

            for (let instr of instructions)
                grid.executeInstruction(instr);

            console.log(`Day 22 Part 1: ${grid.onCount()}`);
            perf.end();
        });
    }
}