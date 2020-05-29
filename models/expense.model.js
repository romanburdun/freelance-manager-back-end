const fs = require('fs')
const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
        expenseTitle: {
            type: String,
            required: true
        },
        expenseAmount: {
            type: Number,
            required: true
        },
        expenseDate: {
            type: Date,
            required: true
        },
        expenseProof: {
            type: String
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        }

})


module.exports = mongoose.model('Expense', ExpenseSchema);
