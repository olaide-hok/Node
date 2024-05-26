const fs = require('fs/promises');

(async () => {
    const commandFileHandler = await fs.open('./command.txt', 'r');

    commandFileHandler.on('change', async () => {
        // get the size of the file
        const size = (await commandFileHandler.stat()).size;
        // allocaate buffer with the size of the file
        const buff = Buffer.alloc(size);
        // the location at which buffer should start filing
        const offset = 0;
        // how many bytes to read
        const length = buff.byteLength;
        // the position that reading the file should from
        const position = 0;

        // read the whole content of the file (from the beginning all the way to the end of the file.)
        const content = await commandFileHandler.read(
            buff,
            offset,
            length,
            position
        );
        console.log(content);
    });

    // watcher ...
    const watcher = fs.watch('./command.txt');
    for await (const event of watcher) {
        if (event.eventType === 'change') {
            commandFileHandler.emit('change');
        }
    }
})();
