
const mongoose = require('mongoose');
const Project = require('../models/project.model')
const ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter client's name"]

    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    incomePlatform: {
            type: mongoose.Schema.ObjectId,
            ref: 'IncomePlatform',
            required: true,
        },
     projects:[{type: mongoose.Schema.ObjectId, ref: 'Project'}],




})

ClientSchema.pre('remove', async function (next) {
        if(this.projects.length > 0 ) {
            for (const project of this.projects) {
                let deleteProject = await Project.findById(project);
                if(deleteProject !== null) {
                    deleteProject.remove();
                }
            }
        }
    next();

})

module.exports = mongoose.model('Client', ClientSchema);
