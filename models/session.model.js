
const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    sessionDate: {
        type: Date,
        required: true,
    },
    sessionStart: {
        type: Date,
        required: true
    },
    sessionEnd: {
        type: Date,
        required: true
    },
    tasks: [
        {type: mongoose.Schema.ObjectId, ref: 'Task'}
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

})

module.exports = mongoose.model('Session', SessionSchema);
