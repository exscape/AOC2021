import fs from 'fs';
import { Solution } from './solution.js';

class Day1Part1 implements Solution {
    parseData(data: string) {
        let increases = 0;
        let lines = data.split("\n");
        for (let tmp in lines) {
            let i = parseInt(tmp);
            if (i === 0) continue; // TODO
            if (parseInt(lines[i]) > parseInt(lines[i-1]))
                increases++;
        }
        console.log(`Day 1 Part 1: ${increases}`)
    }

    answer() {
        fs.readFile('data/day1.txt', "utf8", (err, data) => {
            if (err) {
                console.error(err)
                return
            }
            this.parseData(data)
        })
    }
}

export { Day1Part1 };