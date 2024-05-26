const fs = require('fs/promises');

(async () => {
    const createFile = async (path) => {
        try {
            const existingFileHandle = await fs.open(path, 'r');
            existingFileHandle.close();
            return console.log(`The file ${path} already exists.`);
        } catch (error) {
            // file doesn't exist, hence create it.
            const newFileHandle = await fs.open(path, 'w');
            console.log('A new file was successfuly created.');
            newFileHandle.close();
        }
    };

    const deleteFile = async (path) => {
        console.log(`Deleting ${path}...`);
    };

    const renameFile = (oldPath, newPath) => {
        console.log(`Rename ${oldPath} to ${newPath}`);
    };

    const addToFile = (path, content) => {
        console.log(`Adding to ${path}`);
        console.log(`Content to add: ${content}`);
    };

    // commands
    const CREATE_FILE = 'create a file';
    const DELETE_FILE = 'delete the file';
    const RENAME_FILE = 'rename the file';
    const ADD_TO_FILE = 'add to the file';

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
        await commandFileHandler.read(buff, offset, length, position);

        const command = buff.toString('utf-8');

        // create a file:
        // create a file <path>
        if (command.includes(CREATE_FILE)) {
            const filePath = command.substring(CREATE_FILE.length + 1);
            createFile(filePath);
        }

        // delete a file:
        // delete a file <path>
        if (command.includes(DELETE_FILE)) {
            const filePath = command.substring(DELETE_FILE.length + 1);
            deleteFile(filePath);
        }

        // rename file:
        // rename the file <old-path> to <new-path>
        if (command.includes(RENAME_FILE)) {
            const _idx = command.indexOf(' to ');
            const oldFilePath = command.substring(RENAME_FILE.length + 1, _idx);
            const newFilePath = command.substring(_idx + 4);

            renameFile(oldFilePath, newFilePath);
        }

        // add to file
        // add to the file <path> this content: <content>
        if (command.includes(ADD_TO_FILE)) {
            const _idx = command.indexOf(' this content: ');
            const filePath = command.substring(ADD_TO_FILE.length + 1, _idx);
            const content = command.substring(_idx + 15);

            addToFile(filePath, content);
        }
    });

    // watcher ...
    const watcher = fs.watch('./command.txt');
    for await (const event of watcher) {
        if (event.eventType === 'change') {
            commandFileHandler.emit('change');
        }
    }
})();
