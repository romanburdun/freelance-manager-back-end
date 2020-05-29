const {invoiceOneId, invoiceTwoId, projectOneId, userOneId, projectTwoId} = require('./ids.fixture')


let invoiceOne = {
    _id: invoiceOneId,
    project: projectOneId,
    projectTitle: 'Invoice project jest test',
    paymentDate: new Date('2020-04-22'),
    paymentAmount: 400,
    invoiceFile: 'download__invoice_test.png',
    user: userOneId
}

let invoiceTwo = {
    _id: invoiceTwoId,
    project: projectTwoId,
    projectTitle: 'Invoice project jest test',
    paymentDate: new Date('2015-06-04'),
    paymentAmount: 400,
    invoiceFile: 'download__invoice_test.png',
    user: userOneId
}

module.exports = {
    invoiceOne,
    invoiceTwo
}