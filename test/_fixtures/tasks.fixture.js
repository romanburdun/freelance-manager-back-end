const {deleteTaskId, projectOneId} = require('./ids.fixture')




const bulkTasks = [
    {
        title: 'Test task jest runner one',
        completed: false,
        project: projectOneId
    },
    {
        title: 'Test task jest runner two',
        completed: false,
        project: projectOneId
    }
]

const task = {
    title: 'Test single task jest',
    completed: false,
    project: projectOneId
}

const taskDelete = {
    _id: deleteTaskId,
    title: 'Test single task to delete jest',
    completed: false,
    project: projectOneId
}

module.exports = {
    bulkTasks,
    task,
    taskDelete,

}
