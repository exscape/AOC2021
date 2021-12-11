import { Solution } from './solution.js';
import { readFile, arraySum, GenericGrid } from './common.js';

class Square {
    value: number;
    drawn: boolean;

    constructor(value: number, drawn: boolean) {
        this.value = value;
        this.drawn = drawn;
    }
}

class Board extends GenericGrid<Square> {
    hasWon = false;
    lastDraw = -1;

    initialize(lines: string[]) {
        for (let line of lines) {
            let row = line.trim()
                          .split(new RegExp("\\s+"))
                          .map(s => new Square(parseInt(s), false));
            this._squares.push(row);
        }

        return this;
    }

    mark(draw: number) {
        this.lastDraw = draw;

        for (let square of this.squares()) {
            if (square.value == draw)
                square.drawn = true;
        }
    }

    hasBingo(): boolean {
        if (this.rows().some(row => this.lineHasBingo(row)) || this.columns().some(col => this.lineHasBingo(col))) {
            this.hasWon = true;
            return true;
        }

        return false;
    }

    score(): number {
        // Find the sum of all unmarked numbers, then multiply by lastDraw
        return this.lastDraw * arraySum([...this.squares()]
                                       .filter(sq => !sq.drawn)
                                       .map(sq => sq.value));
    }

    lineHasBingo(line: Square[]): boolean {
        return line.every(square => square.drawn);
    }
}

export class Day4 implements Solution {
    answer() {
        readFile("data/day4.txt", (data) => {
            let [numbers, ...board_data] = data.split("\r\n\r\n");
            let boards = board_data.map(lines => new Board().initialize(lines.split("\r\n")));

            outer:
            for (let drawnStr of numbers.split(",")) {
                let draw = parseInt(drawnStr);

                for (let board of boards) {
                    board.mark(draw);

                    if (board.hasBingo()) {
                        if (boards.length == board_data.length) {
                            // True if this is the first winner, as no boards have been removed from the game yet
                            console.log(`Day 4 Part 1: ${board.score()}`);
                        }
                        else if (boards.length == 1) {
                            console.log(`Day 4 Part 2: ${board.score()}`);
                            break outer
                        }
                        boards = boards.filter((b: Board) => b != board);
                    }
                }
            }
        });
    }
}