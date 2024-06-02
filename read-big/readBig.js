const fs = require('node:fs/promises');

(async () => {
    console.time('readBig');
    const fileHandleRead = await fs.open('src.txt', 'r');
    const fileHandleWrite = await fs.open('dest.txt', 'w');

    const streamRead = fileHandleRead.createReadStream(); // Has a highWaterMark of 64*1024 than the write highWaterMark value.

    const streamWrite = fileHandleWrite.createWriteStream();

    let split = '';
    streamRead.on('data', (chunk) => {
        const numbers = chunk.toString('utf-8').split('  '); // split at double spaces.

        if (Number(numbers[0] !== Number(numbers[1] - 1))) {
            if (split) numbers[0] = split.trim() + numbers[0].trim();
        }

        if (
            Number(numbers[numbers.length - 2]) + 1 !==
            Number(numbers[numbers.length - 1])
        ) {
            split = numbers.pop();
        }

        numbers.forEach((number) => {
            let n = Number(number);

            // Check for even numbers
            if (n % 2 === 0) {
                if (!streamWrite.write(' ' + n + ' ')) {
                    streamRead.pause();
                }
            }
        });
    });

    streamWrite.on('drain', () => {
        streamRead.resume();
    });

    streamRead.on('end', () => {
        console.log('Done reading!');
        console.timeEnd('readBig');
    });
})();
