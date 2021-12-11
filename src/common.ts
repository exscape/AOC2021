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

export class Coordinate {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class GenericGrid<Type> {
    _squares: Type[][];

    constructor() {
        this._squares = [];
    }

    at = (coord: Coordinate) => this._squares[coord.y][coord.x];
    height = () => this._squares.length;
    width = () => this._squares[0].length;

    *coords() {
        for (let y = 0; y < this.height(); y++) {
            for (let x = 0; x < this.width(); x++) {
                yield new Coordinate(x, y);
            }
        }
    }

    adjacentCoordinates(coord: Coordinate, includeDiagonals?: boolean): Coordinate[] {
        includeDiagonals ??= true;
        const [x, y] = [coord.x, coord.y];
        let list = [new Coordinate(x, y-1), new Coordinate(x, y+1), new Coordinate(x-1, y), new Coordinate(x+1, y)];
        if (includeDiagonals)
            list.push(...[new Coordinate(x-1, y-1), new Coordinate(x+1, y-1), new Coordinate(x-1, y+1), new Coordinate(x+1, y+1)]);

        return list.filter(c => c.x >= 0 && c.y >= 0 && c.x < this.width() && c.y < this.height());
    }

    adjacentSquares(coord: Coordinate, includeDiagonals?: boolean): Type[] {
        return this.adjacentCoordinates(coord, includeDiagonals).map(coord => this.at(coord));
    }

    columns(): Type[][] {
        // Transpose the matrix to make the columns into rows (and vice versa)
        return this._squares[0].map((_,i) => this._squares.map(x => x[i]));
    }

    // Added as a counterpart to columns(), makes for prettier code, e.g.
    // if (this.rows().some(row => this.lineHasBingo(row)) || this.columns().some(col => this.lineHasBingo(col)))
    rows(): Type[][] {
        return this._squares;
    }

    *squares() {
        for (let coord of this.coords())
            yield this.at(coord);
    }
}