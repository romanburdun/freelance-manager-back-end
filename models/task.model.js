
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        completed: {
            type: Boolean,
            default: false,
        },
        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: true
        },

},
    {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
    }
    )


module.exports = mongoose.model('Task', TaskSchema);
