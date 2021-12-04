import { Solution } from './solution.js';
import { readLines } from './common.js';

function mostCommon(lines: string[], position: number) {
    let ones = 0;
    for (let line of lines) {
        if (line[position] == "1") {
            ones++;
        }
    }

    return (ones >= lines.length / 2) ? 1 : 0;
}

class Day3 implements Solution {
    answer() {
        readLines("data/day3.txt", (lines) => {
            lines = lines.filter((s) => s.length > 0);
            
            // Part 1
            let gammaRate = 0;
            for (let i = 0; i < 12; i++) {
                if (mostCommon(lines, i) == 1)
                    gammaRate |= (1 << (11-i));
            }

            let epsilonRate = ~gammaRate & 0xfff;
            console.log(`Day 3 Part 1: ${gammaRate * epsilonRate}`)

            // Part 2
            let filteredLines = [...lines];
            for (let i = 0; i < 12 && filteredLines.length > 1; i++) {
                filteredLines = filteredLines.filter((s) => parseInt(s[i]) == mostCommon(filteredLines, i));
            }
            let oxygenGeneratorRating = parseInt(filteredLines[0], 2)

            filteredLines = [...lines];
            for (let i = 0; i < 12 && filteredLines.length > 1; i++) {
                filteredLines = filteredLines.filter((s) => parseInt(s[i]) != mostCommon(filteredLines, i));
            }
            let CO2ScrubberRating = parseInt(filteredLines[0], 2)

            console.log(`Day 3 Part 2: ${oxygenGeneratorRating! * CO2ScrubberRating!}`);
        });
    }
}

export { Day3 }
