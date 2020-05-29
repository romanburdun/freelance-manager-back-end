const asyncHandler = require('../middleware/async');
const Project = require('../models/project.model');
const ErrorResponse = require('../utils/errorResponse');
const Client = require('../models/client.model');
const sanitizeHTML = require('sanitize-html');
const {setDateOffset} = require('../utils/datesUtils');


//@desc     Get all projects
//@route    GET /api/v1/projects
//@access   Private
exports.getAllProjects = asyncHandler( async (req,res,next) => {

    res
        .status(200)
        .json( res.advancedResults)
})

//@desc     Create project
//@route    POST /api/v1/projects
//@access   Private
exports.createProject = asyncHandler( async (req,res,next) => {

    let {title, brief, startDate, endDate, client, status , payment, paymentDate} = req.body;

    let userId = req.user.id

    if(!title || !brief || !endDate || !client || !status) {
        return next(new ErrorResponse("Invalid request", 400))
    };

    let foundClient = await Client.findOne({_id: client, user: userId});

    if(!foundClient) {
        return next(new ErrorResponse(`Client not found`));
    }

    let updatedProjectsList = foundClient.projects


    startDate = setDateOffset(new Date(new Date(startDate).setHours(0,0,0,0)));
    endDate = setDateOffset(new Date(new Date(endDate).setHours(0,0,0,0)));

    if(paymentDate) {
        paymentDate = setDateOffset(new Date(new Date(paymentDate).setHours(0,0,0,0)));
    }

    title = sanitizeHTML(title)
    brief = sanitizeHTML(brief)
    let newProject = {
        title,
        brief,
        endDate,
        startDate,
        user: userId,
        status,
        payment,
        paymentDate
    }

    let project = await Project.create(newProject);
    updatedProjectsList.push(project._id)

   await Client.findByIdAndUpdate(client, {projects: updatedProjectsList},{
        new: true,
        runValidators: true
    })

    let createdProject = await Project.findById(project._id).populate(['client', 'tasks']);

    res
        .status(200)
        .json({
            success: true,
            data: createdProject
        })
})

//@desc     Get project by ID
//@route    GET /api/v1/projects/:projectId
//@access   Private
exports.getProjectById = asyncHandler( async (req,res,next) => {

    const {projectId} = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({_id: projectId, user: userId}).populate('tasks')

    if(!project) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(project.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }

    res
        .status(200)
        .json({
            success: true,
            data: project
        })
})

//@desc     Update project by ID
//@route    PUT /api/v1/projects/:projectId
//@access   Private
exports.updateProject = asyncHandler( async (req,res,next) => {

    const {projectId} = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({_id: projectId, user: userId})

    if(!project) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(project.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }

     let {title, brief, startDate, endDate} = req.body

    if(!title || !brief || !endDate) {
        return next(new ErrorResponse(`Invalid request`, 400))
    }

    title = sanitizeHTML(title)
    brief = sanitizeHTML(brief)

    let {payment, paymentDate} = req.body

    if(paymentDate === null || paymentDate === undefined) {
        payment = 0
        paymentDate = null
    }

    paymentDate =  setDateOffset(new Date(new Date(paymentDate).setHours(0,0,0,0)));
    startDate = setDateOffset(new Date(new Date(startDate).setHours(0,0,0,0)));
    endDate = setDateOffset(new Date(new Date(endDate).setHours(0,0,0,0)));

    let updatedProjectData = {
        title:title,
        brief: brief,
        startDate: startDate,
        endDate: endDate,
        status: req.body.status,
        client: req.client,
        payment,
        paymentDate
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.projectId, updatedProjectData, {
        new: true,
        runValidators: true
    }).populate(['client', 'tasks'])

    res
        .status(200)
        .json({
            success: true,
            data: updatedProject
        })
})

//@desc     Delete project by ID
//@route    DELETE /api/v1/projects/:projectId
//@access   Private
exports.deleteProject = asyncHandler( async (req,res,next) => {

    const {projectId} = req.params;
    const userId = req.user.id;

    const project = await Project.findOne({_id: projectId, user: userId})

    if(!project || project.user.toString() !== userId) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    const client = await Client.findOne( {projects: project._id} )

    let updatedProjectsList = client.projects;
    updatedProjectsList = updatedProjectsList.filter(proj => proj.toString() != project._id.toString())

    await Client.findOneAndUpdate({projects: project._id}, {projects: updatedProjectsList}, {
        new:true
    })

   project.remove();

    res
        .status(200)
        .json({
            success: true
        })
})



