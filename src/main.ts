import { Perf } from './common.js';
import { Day1 } from './day1.js';
import { Day2 } from './day2.js';
import { Day3 } from './day3.js';
import { Day4 } from './day4.js';
import { Day5 } from './day5.js';
import { Day6 } from './day6.js';
import { Day7 } from './day7.js';
import { Day8_Rewrite } from './day8_rewrite.js';
import { Day8_TESTING } from './day8_TESTING.js';
import { Day9 } from './day9.js';
import { Day10 } from './day10.js';
import { Day11 } from './day11.js';
import { Day12 } from './day12.js';
import { Day13 } from './day13.js';
import { Day14 } from './day14.js';

// Saves 20 microseconds the next time it's run -- JIT I suppose?
let perf = new Perf();
perf.end(false);

let days = [new Day1(), new Day2(), new Day3(), new Day4(), new Day5(), new Day6(), new Day7(),
            new Day8_Rewrite(), new Day9(), new Day10(), new Day11(), new Day12(), new Day13(),
            new Day14()];

/*for (let day of days) {
    day.answer();
}*/

days[days.length-1].answer();