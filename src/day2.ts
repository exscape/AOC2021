import { Solution } from './solution.js';
import { readLines } from './common.js';

class Day2 implements Solution {
    answer() {
        readLines("data/day2.txt", (lines) => {
            // Index 0 = Part 1 solution, index 1 = Part 2 solution
            let position = [0, 0];
            let depth = [0, 0];
            let aim = 0;
            for (let line of lines) {
                let [command, arg] = line.split(" ");
                let value = parseInt(arg);
                switch (command) {
                    case "up":
                        depth[0] -= value;
                        aim -= value;
                        break;
                    case "down":
                        depth[0] += value;
                        aim += value;
                        break;
                    case "forward":
                        position[0] += value;
                        position[1] += value;
                        depth[1] += aim * value;
                        break;
                }
            }

            console.log(`Day 2 Part 1: ${position[0] * depth[0]} (pos=${position[0]}, depth=${depth[0]})`);
            console.log(`Day 2 Part 2: ${position[1] * depth[1]} (pos=${position[1]}, depth=${depth[1]}, aim=${aim})`);
        })
    }
}

export { Day2 }