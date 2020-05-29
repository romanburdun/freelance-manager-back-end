// const createCSVWriter = require('csv-writer').createObjectCsvWriter;
const fastcsv = require('fast-csv');
const fs = require('fs');



exports.createReport = async (filePath, records) => {
const ws = fs.createWriteStream(filePath);
    fastcsv.write(records, {headers: true})
        .pipe(ws);

}
