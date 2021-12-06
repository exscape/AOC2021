import { Solution } from './solution.js';
import { readFile } from './common.js';

class Day6 implements Solution {
    lanternfish: number[] = [];
    day = 0;

    evolve() {
        this.lanternfish = this.lanternfish.flatMap(timer => {
            if (timer > 0)
                return timer-1;
            else {
                return [6, 8];
            }
        })
        this.day++;
    }

    print() {
        console.log(`After ${this.day} days: ${this.lanternfish.length} fish`);
    }

    answer() {
        readFile("data/day6.txt", (data) => {
            this.lanternfish = data.split(",").map(s => parseInt(s));
            for (let i = 0; i <= 80; i++) {
                this.print();
                this.evolve();
            }
        });
    }
}

export { Day6 }