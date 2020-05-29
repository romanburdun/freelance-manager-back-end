const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const platformOneId = new mongoose.Types.ObjectId();
const platformDeleteId = new mongoose.Types.ObjectId();
const emptyId = new mongoose.Types.ObjectId();
const userOneId = new mongoose.Types.ObjectId();

const projectOneId = new mongoose.Types.ObjectId();
const projectTwoId = new mongoose.Types.ObjectId();
const projectCreateId = new mongoose.Types.ObjectId();
const projectDeleteId = new mongoose.Types.ObjectId();
const projectCreateInvalidId = new mongoose.Types.ObjectId();
const projectNotExistsId = new mongoose.Types.ObjectId();
const clientOneId = new mongoose.Types.ObjectId();
const clientDeleteId = new mongoose.Types.ObjectId();
const expenseOneId = new mongoose.Types.ObjectId();
const expenseDeleteId = new mongoose.Types.ObjectId();
const deleteTaskId = new mongoose.Types.ObjectId();
const sessionOneId = new mongoose.Types.ObjectId();
const sessionTwoId = new mongoose.Types.ObjectId();
const sessionThreeId = new mongoose.Types.ObjectId();
const sessionFourId = new mongoose.Types.ObjectId();
const invoiceOneId = new mongoose.Types.ObjectId();
const invoiceTwoId = new mongoose.Types.ObjectId();


const token = jwt.sign({id: userOneId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});


const tokenEmptyUser = jwt.sign({id: emptyId}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY});

module.exports = {
    platformOneId,
    emptyId,
    userOneId,
    projectOneId,
    projectTwoId,
    projectCreateId,
    projectDeleteId,
    clientOneId,
    clientDeleteId,
    token,
    tokenEmptyUser,
    deleteTaskId,
    projectCreateInvalidId,
    projectNotExistsId,
    expenseOneId,
    expenseDeleteId,
    platformDeleteId,
    sessionOneId,
    sessionTwoId,
    sessionThreeId,
    sessionFourId,
    invoiceOneId,
    invoiceTwoId
};
