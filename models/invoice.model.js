
const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({

        project: {
            type: mongoose.Schema.ObjectId,
            ref: 'Project',
            required: true
        },
        projectTitle: {
            type: String,
            required: true,
        },
        paymentDate: {
            type: Date,
            required: true,
        },
        paymentAmount: {
            type: Number,
            required: true
        },
        invoiceFile: {
            type: String,
        },
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        }


})

module.exports = mongoose.model('Invoice', InvoiceSchema);
