const Task = require('../models/task.model');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse')
const Project = require('../models/project.model')


//@desc     Create task
//@route    POST /api/v1/tasks
//@access   Private
exports.createTask = asyncHandler( async (req,res,next) => {

    const { title, project } = req.body;

    if(!title || !project) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    const userId = req.user.id;

    const fetchedProject = await Project.findOne({_id: project, user: userId})

    if(!fetchedProject) {
        return next(new ErrorResponse(`Project not found`, 404))
    }

    const task = await Task.create(req.body)

    res
        .status(200)
        .json({
            success: true,
            data: task
        })
})


//@desc     Bulk upload tasks
//@route    POST /api/v1/tasks/:projectId/bulk
//@access   Private
exports.bulkUpload = asyncHandler( async (req,res,next) => {

    let createdTasks = null;

    const {projectId} = req.params;
    const userId = req.user.id;
    const fetchedProject = await Project.findOne({_id: projectId, user: userId});

    if(!fetchedProject) {
        return next(new ErrorResponse(`Project not found.`, 404))
    }

    const tasks = req.body;

    if(tasks !== undefined && tasks.length > 0) {

        tasks.forEach(task=> {
            task.project = req.params.projectId;
        })

        createdTasks = await Task.insertMany(tasks);
    }

    res
        .status(200)
        .json({
            success: true,
            data: createdTasks
        })
})

//@desc     Delete task
//@route    PUT /api/v1/tasks/:taskId
//@access   Private
exports.deleteTask = asyncHandler( async (req,res,next) => {

    const task = await Task.findById(req.params.taskId);

    if(!task) {
        return next(ErrorResponse(`Resource not found`, 404));

    }

    const deleteTask = await Task.findByIdAndRemove(req.params.taskId)

    res.status(200).json({
        success: true,
        data: deleteTask
    })

})


