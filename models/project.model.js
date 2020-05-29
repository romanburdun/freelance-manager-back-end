const Task = require('./task.model')
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
        title : {
            type: String,
            required: [true, "Please add project's title."],
        },
        brief: {
            type: String,
            required: [true,"Please add project's brief" ],
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
            required: [true, "Please enter project's end date"]
        },
        status: {
            type: String,
            enum: ['agreed', 'started', 'delivered', 'canceled' ]
        },
        payment:{
            type: Number,
        },
        paymentDate: {
          type: Date,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        projectInvoice: {
            type: mongoose.Schema.ObjectId,
            ref: 'Invoice'
        },
        createdAt: {
            type: Date,
            default: Date.now()
        }

 }, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

ProjectSchema.pre('remove', async function (next) {

    await Task.deleteMany({project: this._id});
    next();

})

ProjectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'project',
    JustOne: false
});

ProjectSchema.virtual('client', {
    ref: 'Client',
    localField: '_id',
    foreignField: 'projects',
    JustOne: false
});






module.exports = mongoose.model('Project',ProjectSchema);
