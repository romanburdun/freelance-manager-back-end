const {
    projectOneId,
    projectTwoId,
    projectCreateId,
    projectDeleteId,
    projectCreateInvalidId,
    userOneId,
    clientOneId,
    projectNotExistsId
} = require('./ids.fixture')


const todayDate = new Date()


const projectOne = {
    _id: projectOneId,
    title: 'Unit test project name',
    brief: 'Test brief',
    startDate: todayDate,
    endDate: new Date(todayDate.getDate() + 21),
    status: 'started',
    payment: 0,
    paymentDate: null,
    user: userOneId,


}

const projectTwo = {
    _id: projectTwoId,
    title: 'Past project name',
    brief: 'Test brief',
    startDate: new Date('2015-05-05'),
    endDate: new Date('2015-06-1'),
    status: 'delivered',
    payment: 100,
    paymentDate: new Date("2015-06-04"),
    user: userOneId,


}

const projectDelete = {
    _id: projectDeleteId,
    title: 'Unit test project name to be deleted',
    brief: 'Test brief to be deleted',
    startDate: todayDate,
    endDate: new Date(todayDate.getDate() + 21),
    status: 'canceled',
    payment: 0,
    paymentDate: null,
    user: userOneId,


}

const projectCreate = {
    _id: projectCreateId,
    title: 'Unit test project that is created',
    brief: 'Test brief of created project',
    startDate: todayDate,
    endDate: new Date(todayDate.getDate() + 21),
    status: 'agreed',
    payment: 0,
    paymentDate: null,
    user: userOneId,
    client: clientOneId


}

const projectCreateInvalid = {
    _id: projectCreateInvalidId,

    startDate: todayDate,
    endDate: new Date(todayDate.getDate() + 21),
    status: 'agreed',
    payment: 0,
    paymentDate: null,
    user: userOneId,
    client: clientOneId


}
const projectNotExists = {
    _id: projectNotExistsId,
    title: 'Unit test project does not exists',
    brief: 'Test brief of not existing project',

    startDate: todayDate,
    endDate: new Date(todayDate.getDate() + 21),
    status: 'agreed',
    payment: 0,
    paymentDate: null,
    user: userOneId,
    client: clientOneId


}

const projectUpdate = {
    title: 'Unit test project that is updated',
    brief: 'Test brief of updated project',
    startDate: todayDate,
    endDate: new Date(todayDate.getDate() + 21),
    status: 'started',
    payment: 0,
    paymentDate: null,
    client: clientOneId
}

module.exports = {
    projectOne,
    projectTwo,
    projectCreate,
    projectUpdate,
    projectDelete,
    projectCreateInvalid
}
