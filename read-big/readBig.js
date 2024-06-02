const fs = require('node:fs/promises');

(async () => {
    const fileHandleRead = await fs.open('src.txt', 'r');
    const fileHandleWrite = await fs.open('dest.txt', 'w');

    const streamRead = fileHandleRead.createReadStream(); // Has a highWaterMark of 64*1024 than the write highWaterMark value.

    const streamWrite = fileHandleWrite.createWriteStream();

    streamRead.on('data', (chunk) => {
        if (!streamWrite.write(chunk)) {
            streamRead.pause();
        }
    });

    streamWrite.on('drain', () => {
        streamRead.resume();
    });
})();
