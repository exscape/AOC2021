import fs from 'fs';

export function arraySum(array: number[]): number {
    return array.reduce((a, b) => a + b, 0);
}

export function readFile(path: string, callback: {(data: string): void}) {
    fs.readFile(path, "utf8", (err, data) => {
        if (err) {
            console.error("Fatal error, exiting: " + err);
            process.exit(1);
        }
        else
            callback(data);
    })
}

export function readLines(path: string, callback: {(lines: string[]): void}) {
    readFile(path, (data) => {
        callback(data.split("\r\n"));
    })
}

export class Perf {
    start: bigint;
    constructor() {
        this.start = process.hrtime.bigint();
    }

    end(printResult?: boolean) {
        let end = process.hrtime.bigint();
        let diff = end - this.start;
        if (printResult !== false)
            console.log(`Time taken: ${diff / 1000n} microseconds`);
    }
}