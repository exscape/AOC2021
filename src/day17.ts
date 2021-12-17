import { Solution } from './solution.js';
import { readFile } from './common.js';

/*
We can sort-of use the equations of motion here.
a_x = -1 until x = 0 (since we will never fire towards -x, we can ignore negative values of x velocity)
a_y = -1 always
v_x(t) = max(v_0x - t, 0)
v_y(t) = v_0y - t

Since the x velocity decreases due to drag (not proportional to the velocity), we need enough initial x velocity to actually reach the target zone.
0 velocity -> total x displacement = 0
1 velocity -> total x displacement = 1
2 velocity -> total x displacement = 3
3 velocity -> total x displacement = 6
4 velocity -> total x displacement = 10
... again we have the triangle numbers.
total_displacement = v_0x * (v_0x+1) / 2

This means there is a minimum velocity needed to reach the target area:
v_0x * (v_0x + 1) / 2 >= targetArea.minX
(v_0x)^2 + v_0x >= 2*targetArea.minX
(v_0x)^2 + v_0x - 2*targetArea.minX >= 0
... which has the form
x^2 + x - 2C >= 0
v_0x = -1 +/- sqrt(1^2 - 4*1*-2C) / 2
     = -0.5 + sqrt(1 - -8C) / 2
    = -0.5 + sqrt(1 + 8*targetArea.minX)/2
*/

// Minimum initial X velocity needed to reach x coordinate, considering drag
function minXVelocity(targetX: number) { return Math.ceil(-0.5 + Math.sqrt(1 + 8*targetX)/2); }

class TargetArea {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;

    constructor(data: string) {
        [this.minX, this.maxX, this.minY, this.maxY] = [...data.matchAll(/target area: x=(-?\d+)..(-?\d+), y=(-?\d+)..(-?\d+)/g)][0]
                                                       .slice(1,5)
                                                       .map(m => parseInt(m.toString()));
    }
}

function isInsideTargetArea(x: number, y: number, t: TargetArea) {
    return x >= t.minX && x <= t.maxX && y >= t.minY && y <= t.maxY;
}

function probeHitsTargetArea(xVelocity: number, yVelocity: number, targetArea: TargetArea): boolean {
    let [x, y] = [0, 0];
    do {
        x += xVelocity;
        y += yVelocity;
        if (xVelocity > 0) xVelocity--; // Can never be negative, we launch to the right, always
        yVelocity--;

        if (isInsideTargetArea(x, y, targetArea))
            return true;
    } while(x <= targetArea.maxX && y >= targetArea.minY); // I think we could test strictly less than/greater than here, but one extra iteration won't hurt

    return false;
}

export class Day17 implements Solution {
    answer() {
        readFile("data/day17.txt", (data) => {
            // Example data:
            //data = "target area: x=20..30, y=-10..-5";

            let targetArea = new TargetArea(data);

            // Not sure how to limit these better, but these values are sane (though excessive) and should never miss a correct answer.
            // xVel ranges from the minimum required to reach the target area to high enough to fly past the entire area in the first step.
            // We test yVel until the probe flies past the area.
            let maxYVelocity = 0;
            for (let xVel = minXVelocity(targetArea.minX); xVel <= targetArea.maxX; xVel++) {
                for (let yVel = 0; yVel < 1000; yVel++) {
                    let hits = probeHitsTargetArea(xVel, yVel, targetArea);
                    if (hits) {
                        if (yVel > maxYVelocity)
                            maxYVelocity = yVel;
                    }
                }
            }
            console.log(`Day 17 Part 1: ${maxYVelocity * (maxYVelocity + 1) / 2}`);
        });
    }
}