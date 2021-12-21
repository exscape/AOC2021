import { Solution } from './solution.js';
import { readFile, arraySum } from './common.js';

interface Die {
    roll(): number;
    rollCount(): number;
}

class DeterministicDie implements Die {
    v = 1;
    count = 0;

    roll() {
        let ret = this.v;
        this.v = this.v >= 100 ? 1 : this.v + 1;
        this.count++;
        return ret;
    }

    rollCount() {
        return this.count;
    }
}

export class Day21 implements Solution {
    answer() {
        readFile("data/day21.txt", (data) => {
            let matches = Array.from(data.matchAll(/.*starting position: (\d+)/g));

            let positions = matches.map(m => parseInt(m[1]));
            let scores = [0, 0];
            let currentPlayer = 0;

            let die = new DeterministicDie();

            do {
                let rolls = [die.roll(), die.roll(), die.roll()];
                let rollScore = arraySum(rolls);

                positions[currentPlayer] = (positions[currentPlayer] + rollScore) % 10;
                scores[currentPlayer] += positions[currentPlayer] == 0 ? 10 : positions[currentPlayer];

                currentPlayer = (currentPlayer + 1) % 2;
            } while (scores[0] < 1000 && scores[1] < 1000);

            console.log(`Day 21 Part 1: ${die.rollCount() * Math.min(scores[0], scores[1])}`);
        });
    }
}