const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Session = require('../models/session.model');
const Task = require('../models/task.model');
const {setDateOffset} = require('../utils/datesUtils')
//@desc     Save Pomodoro session with completed tasks
//@route    POST /api/v1/sessions
//@access   Private
exports.createSession = asyncHandler( async (req,res,next) => {

    const {sessionDate, sessionStart, sessionEnd, tasks} = req.body;


    if(!sessionDate || !sessionStart || !sessionEnd) {
        return next(new ErrorResponse("Invalid request", 400))
    }


    req.body.sessionDate = setDateOffset(new Date(new Date(sessionDate).setHours(0,0,0,0)));
    req.body.sessionStart = setDateOffset(new Date(sessionStart));
    req.body.sessionEnd = setDateOffset(new Date(sessionEnd));




    let updatedTasks = [];

    if(tasks !== undefined && tasks.length !== 0) {
        for (const task of tasks) {

            let updatedTask = await Task.findByIdAndUpdate(task._id, {completed: true}, {
                new: true,
                runValidators: true
            })
            updatedTasks.push(updatedTask);
        }
    }

    req.body.user = req.user
    const newSession = await Session.create(req.body);

    let returnedSession = newSession.toObject();
    returnedSession.tasks = updatedTasks;

    res
        .status(200)
        .json({
            success: true,
            data: returnedSession
        })
})

//@desc     Delete pomodoro session
//@route    DELETE  /api/v1/sessions/:sessionId
//@access   Private
exports.deleteSession = asyncHandler( async (req,res,next) => {

    const {sessionId} = req.params;
    const userId = req.user.id

    const session = await Session.findOne({_id: sessionId, user: userId});

    if(!session) {
        return next(new ErrorResponse("Resource not found", 404))
    }

    if(session.user.toString() !== userId) {

        return next(new ErrorResponse("Unauthorized request", 403))
    }

    const deleteSession = await Session.findByIdAndRemove(sessionId);

    res
        .status(200)
        .json({
            success: true,
            data: deleteSession
        })
})



//@desc     Get productivity trends
//@route    GET /api/v1/sessions/trends
//@access   Private
exports.getProductivityTrends = asyncHandler( async (req,res,next) => {

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const WEEK = 1000*24*60*60*7;


    const currentDate = setDateOffset(new Date());



    const weekBehind = new Date(currentDate.getTime() - WEEK);

    const userSessions = await Session.find({user: req.user.id, sessionDate:  {$gte: weekBehind}}).select(['sessionDate', 'sessionStart', 'sessionEnd']).populate('tasks');


    let trendTasksResponse = {
        days: [],
        tasksCompleted: [],
    };
    let trendSessionsResponse = {
        days: [],
        sessionsCompleted: []
    };



    for(weekBehind; weekBehind <= currentDate; weekBehind.setDate(weekBehind.getDate() + 1 ) ) {

        let totalDatedTasks = 0;

        let selectedDate = new Date(weekBehind.getTime());
        selectedDate.setHours(0,0,0,0)


        let datedSessions = userSessions.filter(session => {

                let date = new Date(session.sessionDate.getTime());
                date.setHours(0,0,0,0);

                    if(date.getTime() === selectedDate.getTime()) {
                        // console.log(`Session: ${session}`)
                        return session;
                    }
        });


        let dayOfweek = days[selectedDate.getDay()]
        trendTasksResponse.days.push(dayOfweek);
        trendSessionsResponse.days.push(dayOfweek);
        trendSessionsResponse.sessionsCompleted.push(datedSessions.length)

        datedSessions.forEach(session => {
            if (session.tasks.length !== undefined && session.tasks.length > 0)
                totalDatedTasks += session.tasks.length;

        })

        let prodScore = Math.round((totalDatedTasks / datedSessions.length) * 100) / 100;

        if (prodScore == null || Number.isNaN(prodScore)) {
            prodScore = 0;
        }

        trendTasksResponse.tasksCompleted.push(totalDatedTasks);
    }

    let data = {
        tasksTrends: trendTasksResponse,
        sessionsTrends: trendSessionsResponse
    }

        res
            .status(200)
            .json({
                success: true,
                data: data
            })
})
