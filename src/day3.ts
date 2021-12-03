import { Solution } from './solution.js';
import { readLines } from './common.js';

class Day3 implements Solution {
    answer() {
        readLines("data/day3.txt", (data) => {
            let lines = data.split("\r\n").map((s) => s.split("").reverse().join(""))
                                          .filter((s) => s.length > 0);
            let gammaRate = 0;
            
            for (let i = 0; i < lines[0].length; i++) {
                let ones = 0;
                for (let line of lines) {
                    if (line[i] == "1") {
                        ones++;
                    }
                }

                if (ones > lines.length / 2)
                    gammaRate |= (1 << i);
            }

            let epsilonRate = ~gammaRate & 0xfff;
            console.log(`Day 3 Part 1: ${gammaRate * epsilonRate} (gamma ${gammaRate}, epsilon ${epsilonRate})`)
        });
    }
}

export { Day3 }