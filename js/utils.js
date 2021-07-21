const fs = require('fs');
const { promisify } = require('util');

const readDirectory = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const readJSON = path => readFile(path).then(JSON.parse);

module.exports = {
    readDirectory,
    readFile,
    readJSON
}