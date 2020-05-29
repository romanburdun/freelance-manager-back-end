
const {
    clientOneId,
    clientDeleteId,
    platformOneId,
    projectDeleteId,
    userOneId
} = require('./ids.fixture');

let clientProjects = [];

clientProjects.push(projectDeleteId)

const clientOne = {
    _id: clientOneId,
    name: 'Jennifer Topez',
    incomePlatform: platformOneId,
    projects: clientProjects,
    user: userOneId

}


const clientDelete = {
    _id: clientDeleteId,
    name: 'Tom Ferrer',
    incomePlatform: platformOneId,
    projects: clientProjects,
    user: userOneId

}

module.exports = {
    clientOne,
    clientDelete
}
