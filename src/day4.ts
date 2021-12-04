import { Solution } from './solution.js';
import { readFile, arraySum } from './common.js';

class Square {
    value: number;
    drawn: boolean;

    constructor(value: number, drawn: boolean) {
        this.value = value
        this.drawn = drawn
    }
}

class Board {
    board: Square[][];
    hasWon: boolean;

    constructor(lines: string[]) {
        this.board = []
        this.hasWon = false

        for (let line of lines) {
            let row = line.trim()
                          .split(new RegExp("\\s+"))
                          .map(s => new Square(parseInt(s), false));
            this.board.push(row);
        }
    }

    mark(draw: number) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.board[row][col].value == draw)
                    this.board[row][col].drawn = true
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

    score(lastDraw: number): number {
        // Find the sum of all unmarked numbers, then multiply by lastDraw
        return lastDraw * arraySum(this.board
                                       .flat()
                                       .filter(sq => !sq.drawn)
                                       .map(sq => sq.value));
    }

    lineHasBingo(line: Square[]): boolean {
        return line.every(square => square.drawn);
    }

    boardColumns(): Square[][] {
        // Transpose the matrix to make the columns into rows (and vice versa)
        return this.board[0].map((_,i) => this.board.map(x => x[i]))
    }

    print(draw?: number) {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                if (this.board[row][col].drawn)
                    process.stdout.write('\u001b[' + 41 + 'm');

                process.stdout.write(`${this.board[row][col].value}`);

                if (this.board[row][col].drawn)
                    process.stdout.write('\u001b[0m');
               process.stdout.write(" ");
            }
            process.stdout.write("\n");
        }
        if (draw !== undefined)
            console.log(`Score is: ${this.score(draw)}\n`);
    }
}

class Day4 implements Solution {
    answer() {
        readFile("data/day4.txt", (data) => {
            let [numbers, ...board_data] = data.split("\r\n\r\n");
            let boards = [];

            for (let data of board_data) {
                boards.push(new Board(data.split("\r\n")));
            }

            let winners = new Array<[Board, number]>();

            for (let drawnStr of numbers.split(",")) {
                let draw = parseInt(drawnStr);

                for (let board of boards) {
                    if (board.hasWon)
                        continue;

                    board.mark(draw);

                    if (board.hasBingo())
                        winners.push([board, draw]);
                }

                if (boards.every(b => b.hasWon))
                        break
            }

            console.log("---------- DAY 4 ----------");

            // Part 1
            console.log("First winner:");
            let [board, draw] = winners[0];
            board.print(draw);

            // Part 2
            [board, draw] = winners[winners.length - 1];
            console.log("Last winner:");
            board.print(draw);
            console.log("---------------------------");
        });
    }
}

export { Day4 }