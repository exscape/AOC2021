import { Solution } from './solution.js';
import { readFile, arraySum } from './common.js';

class Day6 implements Solution {
    ages = Array(9).fill(0); // ages[0] = number of fish with timer value 0, etc.

    evolve(steps: number) {
        // All entries except 0 move one step down (8->7, 7->6, ... 1->0).
        // Number of fish at 0 are both added to 6 (those that just spawned new fish),
        // and added at the end of the array (index 8) for the new fish.
        for (let i = 0; i < steps; i++) {
            let zeroes = this.ages.shift();
            this.ages[6] += zeroes; // These just gave birth, reset to 6
            this.ages.push(zeroes); // New births at index 8
        }
    }

    count() {
        return arraySum(this.ages);
    }

    answer() {
        readFile("data/day6.txt", (data) => {
            let lanternfish = data.split(",").map(s => parseInt(s));

            for (let age = 0; age <= 8; age++) {
                this.ages[age] = lanternfish.filter(a => a == age).length;
            }

            this.evolve(80);
            console.log(`Day 6 Part 1: ${this.count()}`);

            this.evolve(256 - 80);
            console.log(`Day 6 Part 2: ${this.count()}`);
        });
    }
}

export { Day6 }