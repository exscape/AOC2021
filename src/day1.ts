import fs from 'fs';

const parseData = (data: string) => {
    let increases = 0;
    let lines = data.split("\n");
    for (let tmp in lines) {
        let i = parseInt(tmp);
        if (i === 0) continue; // TODO
        if (parseInt(lines[i]) > parseInt(lines[i-1]))
            increases++;
    }
    console.log(`Answer: ${increases}`)
}

fs.readFile('data/day1.txt', "utf8", (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    parseData(data)
})