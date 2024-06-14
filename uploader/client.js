const net = require('net');
const fs = require('node:fs/promises');
const path = require('path');

const socket = net.createConnection({host: '::1', port: 5050}, async () => {
    const filePath = process.argv[2];
    const fileName = path.basename(filePath);
    const fileHandle = await fs.open(filePath, 'r');
    const fileReadStream = fileHandle.createReadStream(); // the stream to read from

    socket.write(`fileName: ${fileName}-------`);

    // Reading from the source file
    fileReadStream.on('data', (data) => {
        if (!socket.write(data)) {
            fileReadStream.pause();
        }
    });

    socket.on('drain', () => {
        fileReadStream.resume();
    });

    fileReadStream.on('end', () => {
        console.log('The file was successfully uploaded!');
        socket.end();
    });
});
