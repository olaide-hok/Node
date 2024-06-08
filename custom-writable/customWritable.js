const {Writable} = require('node:stream');
const fs = require('node:fs');

class FileWriteStream extends Writable {
    constructor({highWaterMark, fileName}) {
        super({highWaterMark});

        this.fileName = fileName;
        this.fd = null;
        this.chunks = [];
        this.chunksSize = 0;
        this.writesCount = 0;
    }

    // This will run after the constructor, and it will put off all calling the other methods until we call the callback function.
    _construct(callback) {
        fs.open(this.fileName, 'w', (err, fd) => {
            if (err) {
                // if the callback is called with an argument, it means that an error occurred and we should not proceed further.
                callback(err);
            } else {
                this.fd = fd;
                // no argment means it was successful
                callback();
            }
        });
    }

    _write(chunk, encoding, callback) {
        this.chunks.push(chunk);
        this.chunksSize += chunk.length;

        // write operation...
        if (this.chunksSize > this.writableHighWaterMark) {
            fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
                if (err) {
                    return callback(err);
                }
                this.chunks = [];
                this.chunksSize = 0;
                ++this.writesCount;
                callback();
            });
        } else {
            // when operation is complete, call the callback function
            callback();
        }
    }

    _final(callback) {
        fs.write(this.fd, Buffer.concat(this.chunks), (err) => {
            if (err) return callback(err);

            ++this.writesCount;
            this.chunks = [];
            callback();
        });
    }

    _destroy(error, callback) {
        console.log('Number of writes: ', this.writesCount);
        if (this.fd) {
            fs.close(this.fd, (err) => {
                callback(err || error);
            });
        } else {
            callback(error);
        }
    }
}

// const stream = new FileWriteStream({highWaterMark: 1800, fileName: 'text.txt'});
// stream.write(Buffer.from('this is some string.'));
// stream.end(Buffer.from('Our last write.'));

// stream.on('finish', () => {
//     console.log('Stream finished!');
// });

(async () => {
    console.time('writeMany');

    const stream = new FileWriteStream({
        fileName: 'text.txt',
    });

    let i = 0;

    const numberOfWrites = 1000000;

    const writeMany = () => {
        while (i < numberOfWrites) {
            const buff = Buffer.from(` ${i} `, 'utf-8');

            // this is our last write
            if (i === numberOfWrites - 1) {
                return stream.end(buff);
            }

            // if stream.write returns false, stop the loop
            if (!stream.write(buff)) break;

            i++;
        }
    };

    writeMany();

    let d = 0;
    // resume our loop once our stream's internal buffer is emptied
    stream.on('drain', () => {
        ++d;
        writeMany();
    });

    stream.on('finish', () => {
        console.log('Number of drains:', d);
        console.timeEnd('writeMany');
    });
})();
