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
// const fs = require('node:fs');

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
// (async () => {
//     console.time('writeMany');
//     fs.open('test.txt', 'w', (err, fd) => {
//         for (let i = 0; i < 1000000; i++) {
//             const buff = Buffer.from(` ${i} `, 'utf-8');
//             fs.writeSync(fd, buff);
//         }

//         console.timeEnd('writeMany');
//     });
// })();

// DON"T DO IT THIS WAY
// const fs = require('node:fs/promises');

// Execution Time: 00:01.058 (m:ss.mmm)
// CPU Usage: (one core)
// Memory Usage: high memory usage
// (async () => {
//     console.time('writeMany');
//     const fileHandle = await fs.open('test.txt', 'w');
//     const stream = fileHandle.createWriteStream();

//     for (let i = 0; i < 1000000; i++) {
//         const buff = Buffer.from(` ${i} `, 'utf-8');
//         stream.write(buff);
//     }

//     console.timeEnd('writeMany');
// })();

const fs = require('node:fs/promises');

(async () => {
    console.time('writeMany');
    const fileHandle = await fs.open('test.txt', 'w');
    const stream = fileHandle.createWriteStream();

    // console.log(stream.writableHighWaterMark);

    // // 8 bits = 1 byte
    // // 1000 byte = 1 kilobyte
    // // 1000 kilobyte = 1 megabyte

    // // 1a => 0001 1010

    // const buff = Buffer.alloc(16383, 'a');
    // // console.log(buff);
    // stream.write(buff);
    // console.log(stream.write(buff));
    // console.log(stream.write(Buffer.alloc(1, 'a')));
    // console.log(stream.write(Buffer.alloc(1, 'a')));
    // console.log(stream.write(Buffer.alloc(1, 'a')));
    // console.log(stream.writableLength);

    // stream.on('drain', () => {
    //     console.log(stream.write(Buffer.alloc(1, 'a')));
    //     console.log('We are now safe to write more!');
    //     console.log(stream.writableLength);
    // });

    // setInterval(() => {}, 1000);

    let i = 0;

    const writeMany = () => {
        while (i < 1000000) {
            const buff = Buffer.from(` ${i} `, 'utf-8');

            // this is the last write
            if (i === 999999) {
                return stream.end(buff);
            }

            // if steam.write returns false, stop the loop
            if (!stream.write(buff)) {
                break;
            }
            i++;
        }
    };
    writeMany();

    // resume loop once the stream's internal buffer is emptied.
    stream.on('drain', () => {
        console.log('Drained!!!');
        writeMany();
    });

    stream.on('finish', () => {
        console.timeEnd('writeMany');
        fileHandle.close();
    });
})();
