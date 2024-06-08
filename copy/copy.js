const fs = require('node:fs/promises');

// Streams without Buffer.
// Memory Usage:
// Execution Time: 1.144s
// (async () => {
//     console.time('copy');
//     const destFile = await fs.open('src-copy.txt', 'w');
//     const result = await fs.readFile('src.txt');
//     await destFile.write(result);
//     console.timeEnd('copy');
// })();

// Another approach using streams with Buffer.
// Memory Usage:
// Execution Time: 1.010s
// (async () => {
//     console.time('copy');
//     const srcFile = await fs.open('src.txt', 'r');
//     const destFile = await fs.open('src-copy.txt', 'w');

//     let bytesRead = -1;
//     while (bytesRead !== 0) {
//         const readResult = await srcFile.read();
//         bytesRead = readResult.bytesRead;

//         if (bytesRead !== 16384) {
//             const indexOfNotFilled = readResult.buffer.indexOf(0);
//             const newBuffer = Buffer.alloc(indexOfNotFilled);
//             readResult.buffer.copy(newBuffer, 0, 0, indexOfNotFilled);
//             destFile.write(newBuffer);
//         } else {
//             destFile.write(readResult.buffer);
//         }
//     }
//     console.timeEnd('copy');
// })();

// Another approach using streams with piping
// Memory Usage:
// Execution Time: 525.682ms
(async () => {
    console.time('copy');
    const srcFile = await fs.open('src.txt', 'r');
    const destFile = await fs.open('src-copy.txt', 'w');

    const readStream = srcFile.createReadStream();
    const writeStream = destFile.createWriteStream();

    readStream.pipe(writeStream);

    readStream.on('end', () => {
        console.timeEnd('copy');
    });
})();
