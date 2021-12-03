import fs from 'fs';

function arraySum(array: number[]): number {
    return array.reduce((a, b) => a + b, 0);
}

function readLines(path: string, callback: {(data: string): void}) {
    fs.readFile(path, "utf8", (err, data) => {
        if (err) {
            console.error("Fatal error, exiting: " + err);
            process.exit(1)
        }
        else
            callback(data);
    })
}

export { arraySum, readLines };