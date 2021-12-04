import { Solution } from './solution.js';
import { readFile, arraySum } from './common.js';

class Square {
    value: number;
    drawn: boolean;

    constructor(value: number, drawn: boolean) {
        this.value = value;
        this.drawn = drawn;
    }
}

class Board {
    board: Square[][];
    hasWon: boolean;
    lastDraw: number;

    constructor(lines: string[]) {
        this.board = [];
        this.hasWon = false;
        this.lastDraw = -1;

        for (let line of lines) {
            let row = line.trim()
                          .split(new RegExp("\\s+"))
                          .map(s => new Square(parseInt(s), false));
            this.board.push(row);
        }
    }

    mark(draw: number) {
        this.lastDraw = draw;

        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.board[row][col].value == draw)
                    this.board[row][col].drawn = true;
            }
        }
    }

    hasBingo(): boolean {
        if (this.board.some(row => this.lineHasBingo(row)) || this.boardColumns().some(col => this.lineHasBingo(col))) {
            this.hasWon = true;
            return true;
        }

        return false;
    }

    score(): number {
        // Find the sum of all unmarked numbers, then multiply by lastDraw
        return this.lastDraw * arraySum(this.board
                                       .flat()
                                       .filter(sq => !sq.drawn)
                                       .map(sq => sq.value));
    }

    lineHasBingo(line: Square[]): boolean {
        return line.every(square => square.drawn);
    }

    boardColumns(): Square[][] {
        // Transpose the matrix to make the columns into rows (and vice versa)
        return this.board[0].map((_,i) => this.board.map(x => x[i]));
    }
}

class Day4 implements Solution {
    answer() {
        readFile("data/day4.txt", (data) => {
            let [numbers, ...board_data] = data.split("\r\n\r\n");
            let boards: Board[] = [];

            for (let data of board_data) {
                boards.push(new Board(data.split("\r\n")));
            }

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

export { Day4 }