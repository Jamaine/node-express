const fs = require('fs');

const inputFile = './users.json';
const outputFile = './out.json';

// stream which can read data
const readable = fs.createReadStream(inputFile);
// stream which can have data written to it
const writeable = fs.createWriteStream(outputFile);

// take data from readable and pipe it into writeable
readable.pipe(writeable)
