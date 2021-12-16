import { Solution } from './solution.js';
import { readFile, arraySum, arrayProduct } from './common.js';

class Node {
    value: number | undefined = undefined;
    version: number = -1;
    type = PacketType.Invalid;
    children: Node[] = [];

    constructor() {}
}

enum PacketType {
    Sum = 0,
    Product,
    Minimum,
    Maximum,
    Literal,
    GreaterThan,
    LessThan,
    EqualTo,
    Invalid = -1
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

    if (node.type == PacketType.Literal) {
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
        // The next 15 bits contain the bit length of all sub-packets
        let bitLength = readNumber(15);
        let start = binStr.length;
        while (binStr.length > start - bitLength) {
            let newNode;
            [newNode, binStr] = parsePacket(binStr);
            node.children.push(newNode);
        }
    }
    else {
        // The next 11 bits contain the *number of* sub-packets
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

function performCalculation(node: Node): number {
    let values: number[] = [];

    for (let child of node.children) {
        if (child.type == PacketType.Literal)
            values.push(child.value!);
        else
            values.push(performCalculation(child));
    }

    switch (node.type) {
        case PacketType.Sum:
            return arraySum(values);
        case PacketType.Product:
            return arrayProduct(values);
        case PacketType.Minimum:
            return Math.min(...values);
        case PacketType.Maximum:
            return Math.max(...values);
        case PacketType.GreaterThan:
            return values[0] > values[1] ? 1 : 0;
        case PacketType.LessThan:
            return values[0] < values[1] ? 1 : 0;
        case PacketType.EqualTo:
            return values[0] == values[1] ? 1 : 0;
        default:
            throw new Error("Invalid packet type in performCalculation");
    }
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
            console.log(`Day 16 Part 1: ${totalVersionCount(rootNode)}`);
            console.log(`Day 16 Part 2: ${performCalculation(rootNode)}`);
        });
    }
}