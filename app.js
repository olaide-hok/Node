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
        try {
            await fs.unlink(path);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log('No file at this path to remove.');
            } else {
                console.log('An error occurred while removing the file.');
                console.log(error);
            }
        }
    };

    const renameFile = async (oldPath, newPath) => {
        try {
            await fs.rename(oldPath, newPath);
            console.log(`Renamed ${oldPath} to ${newPath} successfully!`);
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(
                    "No file at this path to rename, or the destination doesn't exist."
                );
            } else {
                console.log('An error occurred while renaming the file.');
                console.log(error);
            }
        }
    };

    // track previously added content
    let addedContent;

    const addToFile = async (path, content) => {
        if (addedContent === content) return;
        try {
            const fileHandle = await fs.open(path, 'a');
            fileHandle.write(content);
            addedContent = content;
            fileHandle.close();
            console.log('The content was added successfully!');
        } catch (error) {
            if (error.code === 'ENOENT') {
                console.log(
                    "No file at this path to add content to, or the destination doesn't exist."
                );
            } else {
                console.log(
                    'An error occurred while adding content to the file.'
                );
                console.log(error);
            }
        }
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
