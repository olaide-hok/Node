// const fs = require('node:fs/promises');

// Execution Time: 2:24.633 (m:ss.mmm)
// CPU Usage: (one core)
// Memory Usage:
// (async () => {
//     console.time('writeMany');
//     const fileHandle = await fs.open('test.txt', 'w');

//     for (let i = 0; i < 1000000; i++) {
//         await fileHandle.write(` ${i} `);
//     }
//     console.timeEnd('writeMany');
// })();

// Using callback approach.
// const fs = require('node:fs');

// (async () => {
//     console.time('writeMany');
//     fs.open('test.txt', 'w', (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             fs.write(fd, ` ${i} `, () => {});
//         }

//         console.timeEnd('writeMany');
//     });
// })();

// Using callback approach.
const fs = require('node:fs');

// Execution Time: 00:15.323 (m:ss.mmm)
// CPU Usage: (one core)
// Memory Usage:
// (async () => {
//     console.time('writeMany');
//     fs.open('test.txt', 'w', (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             fs.writeSync(fd, ` ${i} `);
//         }

//         console.timeEnd('writeMany');
//     });
// })();

// Execution Time: 00:14.175 (m:ss.mmm) with buffer
// CPU Usage: (one core)
// Memory Usage:
(async () => {
    console.time('writeMany');
    fs.open('test.txt', 'w', (err, fd) => {
        for (let i = 0; i < 1000000; i++) {
            const buff = Buffer.from(` ${i} `, 'utf-8');
            fs.writeSync(fd, buff);
        }

        console.timeEnd('writeMany');
    });
})();
