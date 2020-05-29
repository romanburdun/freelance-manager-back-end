const {createFolders} = require('../../utils/folders')
const User = require('../../models/user.model')
const IncomePlatforms = require('../../models/incomePlatform.model')
const Project = require('../../models/project.model')
const Client = require('../../models/client.model')
const Task = require('../../models/task.model')
const Expense = require('../../models/expense.model')
const Session = require('../../models/session.model');
const Invoice = require('../../models/invoice.model')
const {userOne} = require('./user.fixture')
const {platformOne, platformDelete} = require('./platforms.fixture')
const {projectOne, projectDelete, projectTwo} = require('./projects.fixture');
const {clientOne, clientDelete} = require('./clients.fixture')
const {taskDelete} = require('./tasks.fixture')
const {expenseOne, expenseDelete} = require('./expenses.fixture');
const {sessionOne, sessionTwo, sessionThree, sessionFour} = require('./sessions.fixture');
const {invoiceOne, invoiceTwo} = require('../_fixtures/invoices.fixture')


const setUpDB = async () => {
    createFolders();
    await User.deleteMany();
    await new User (userOne).save();
    await Expense.deleteMany();
    await new Expense(expenseOne).save();
    await new Expense(expenseDelete).save();

    await Project.deleteMany();
    await new Project(projectOne).save();
    await new Project(projectTwo).save();
    await new Project(projectDelete).save();
    await Client.deleteMany();
    await new Client(clientOne).save();
    await new Client(clientDelete).save();
    await Task.deleteMany();
    await new Task(taskDelete).save();
    await IncomePlatforms.deleteMany();
    await new IncomePlatforms(platformOne).save();
    await new IncomePlatforms(platformDelete).save();
    await Session.deleteMany();
    await new Session(sessionOne).save();
    await new Session(sessionTwo).save();
    await new Session(sessionThree).save();
    await new Session(sessionFour).save();
    await Invoice.deleteMany();
    await new Invoice(invoiceOne).save();
    await new Invoice(invoiceTwo).save();


}



module.exports = {
    setUpDB,
}

