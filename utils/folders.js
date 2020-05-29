const fs = require("fs");

exports.createFolders = () => {
    if(!fs.existsSync(process.env.FILES_PATH)) {
        fs.mkdir(`${process.env.FILES_PATH}/expenses-proofs`, {recursive: true}, err => {
            if(err) {
                console.log(err)
            }
        })

        fs.mkdir(`${process.env.FILES_PATH}/projects-invoices`, {recursive: true}, err => {
            if(err) {
                console.log(err)
            }
        })

        fs.mkdir(`${process.env.FILES_PATH}/reports`, {recursive: true}, err => {
            if(err) {
                console.log(err)
            }
        })
        console.log("Folders created!")
    }
}


exports.createTestData = () => {

    if(!fs.existsSync(`${process.env.INVOICES_FILE_PATH}/download__invoice_test.png`)) {
        fs.writeFile(`${process.env.INVOICES_FILE_PATH}/download__invoice_test.png`, '000000000', function (err) {
            if (err) throw err;
        });
    }


    if(!fs.existsSync(`${process.env.PROOF_FILE_PATH}/download_test.png`)) {

        fs.writeFile(`${process.env.PROOF_FILE_PATH}/download_test.png`, '000000000', function (err) {
            if (err) throw err;
        });

    }



}
