import { Day1 } from './day1.js';
import { Day2 } from './day2.js';
import { Day3 } from './day3.js';
import { Day4 } from './day4.js';
import { Day5 } from './day5.js';
import { Day6 } from './day6.js';


let days = [new Day1(), new Day2(), new Day3(), new Day4(), new Day5(), new Day6()];

/*for (let day of days) {
    day.answer();
}*/
(new Day6()).answer();