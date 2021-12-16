import { Solution } from './solution.js';
import { readFile } from './common.js';

// Since we're given the hint that there are numbers and operations here, we most certainly want to
// retain the tree structure of the data, and not flatten it to a list of packets.
// That way, we end up with an Abstract Syntax Tree of operations (operators) and numbers.

class Node {
    value: number | undefined = undefined;
    version: number = -1;
    type: number = -1;
    children: Node[] = [];

    constructor() {}

}

function parsePacket(binStr: string): [Node, string] {
    const readBits = (len: number) => {
        let bits = binStr.slice(0, len);
        binStr = binStr.slice(len);
        return bits;
    }

    const readNumber = (len: number) => parseInt(readBits(len), 2)

    let node = new Node();
    node.version = readNumber(3);
    node.type = readNumber(3);

    if (node.type == 4) {
        let bits = "";
        let group;
        do {
            group = readBits(5);
            bits += group.slice(1);
        } while (group[0] == "1");

        node.value = parseInt(bits, 2);

        return [node, binStr];
    }

    // If we're still here, this is an operator packet

    let lengthTypeId = readNumber(1);
    if (lengthTypeId == 0) {
        // The next *15* bits contain the bit length of all sub-packets
        let bitLength = readNumber(15);
        let start = binStr.length;
        while (binStr.length > start - bitLength) {
            let newNode;
            [newNode, binStr] = parsePacket(binStr);
            node.children.push(newNode);
        }
    }
    else {
        // The next *11* bits contain the *number of* sub-packets
        let subPacketCount = readNumber(11);
        for (let i = 0; i < subPacketCount; i++) {
            let newNode;
            [newNode, binStr] = parsePacket(binStr);
            node.children.push(newNode);
        }
    }

    return [node, binStr];
}

function totalVersionCount(node: Node): number {
    let total = 0;
    total += node.version;
    for (let child of node.children)
        total += totalVersionCount(child);

    return total;
}

export class Day16 implements Solution {
    answer() {
        readFile("data/day16.txt", (hexStr) => {
            // In the end this was actually easier than using BigInt or similar.
            let hexToBin: Record<string, string> = {0: "0000", 1: "0001", 2: "0010", 3: "0011", 4: "0100",
                                                    5: "0101", 6: "0110", 7: "0111", 8: "1000", 9: "1001",
                                                    A: "1010", B: "1011", C: "1100", D: "1101", E: "1110",
                                                    F: "1111"};
            let binStr = hexStr.split('').map(d => hexToBin[d]).join('');

            let rootNode = parsePacket(binStr)[0];
            let totalVersion = totalVersionCount(rootNode);
            console.log(`Day 16 Part 1: ${totalVersion}`);
        });
    }
}