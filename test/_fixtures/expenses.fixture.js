const {expenseOneId, userOneId, expenseDeleteId} = require('./ids.fixture')

const expenseOne = {
    _id: expenseOneId,
    expenseTitle: 'Jest expense test',
    expenseAmount: 15.54,
    expenseDate: new Date('01-01-2020'),
    expenseProof: 'download_test.png',
    user: userOneId

}

const expenseDelete = {
    _id: expenseDeleteId,
    expenseTitle: 'Jest expense test',
    expenseAmount: 15.54,
    expenseDate: new Date(),
    expenseProof: null,
    user: userOneId
}


module.exports = {
    expenseOne,
    expenseDelete
}
