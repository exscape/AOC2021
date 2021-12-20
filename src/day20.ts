import { Solution } from './solution.js';
import { readFile, GenericGrid, Coordinate, Perf } from './common.js';

class Grid extends GenericGrid<boolean> {
    outOfBoundsPixelValue = false;

    initialize(data: string[], oob: boolean): Grid {
        for (let line of data) {
            this._squares.push(line.split('').map(c => c == '#'));
        }

        this.outOfBoundsPixelValue = oob;
        return this;
    }

    // The one in GenericGrid is dissimilar enough that a copy/paste/modify is cleaner than changing the original -- I did try that first...
    // The main difference being that the GenericGrid one only select adjacent squares/pixels, not the active one as well.
    // In addition, the ordering is incorrect for this problem.
    adjacentPixels(coord: Coordinate) {
        const isOutOfBounds = (c: Coordinate) => (c.x < 0 || c.x >= this.width() || c.y < 0 || c.y >= this.height());
        let pixels = [];
        for (let y = coord.y - 1; y <= coord.y + 1; y++) {
            for (let x = coord.x - 1; x <= coord.x + 1; x++) {
                let c = new Coordinate(x, y);
                pixels.push(isOutOfBounds(c) ? this.outOfBoundsPixelValue : this.at(c));
            }
        }

        return pixels;
    }

    enhance(imageEnhancement: string): Grid {
        let outputData = [];
        for (let y = -1; y < this.height() + 1; y++) {
            let rowChars = [];
            for (let x = -1; x < this.width() + 1; x++) {
                let coord = new Coordinate(x, y);
                let lookupValue = parseInt(this.adjacentPixels(coord).flatMap(v => v ? "1" : "0").join(''), 2);
                rowChars.push(imageEnhancement[lookupValue]);
            }
            outputData.push(rowChars.join(''));
        }

        // All infinite pixels outside the used grid will be either all zeroes or all ones.
        // In the former case, they should be replaced with imageEnhancement[0], and the latter imageEnhancement[511 = 0b111111111].
        let oob;
        if (this.outOfBoundsPixelValue == false)
            oob = imageEnhancement[0];
        else
            oob = imageEnhancement[511];

        let output = new Grid().initialize(outputData, oob == "#");
        return output;
    }

    litPixelCount() {
        return [...this.squares()]
               .filter(p => p === true)
               .length;
    }
}

function repeatedEnhance(image: Grid, count: number, imageEnhancement: string): Grid {
    for (let i = 0; i < count; i++) {
        image = image.enhance(imageEnhancement);
    }

    return image;
}

export class Day20 implements Solution {
    answer() {
        readFile("data/day20.txt", (data) => {
            let perf = new Perf();
            let [imageEnhancement, imageData] = data.split("\r\n\r\n");

            let image = new Grid().initialize(imageData.split("\r\n"), false);

            image = repeatedEnhance(image, 2, imageEnhancement);
            console.log(`Day 20 Part 1: ${image.litPixelCount()}`);

            image = repeatedEnhance(image, 48, imageEnhancement);
            console.log(`Day 20 Part 2: ${image.litPixelCount()}`);

            perf.end();
        });
    }
}