const Invoice = require('../models/invoice.model');
const Project = require('../models/project.model');
const ErrorResponse = require('../utils/errorResponse');
const fs = require('fs');
const path = require('path')
const asyncHandler = require('../middleware/async');
const {setDateOffset, getPreviousTaxYearDates} = require('../utils/datesUtils')
const {datesRangeQuery} = require('../utils/queries')
//@desc     Get current tax year user's invoices
//@route    GET /api/v1/invoices
//@access   Private
exports.getCurrentTaxYearInvoices = asyncHandler( async (req, res, next) => {

    res
        .status(200)
        .json(res.advancedResults)
})

//@desc     Get user's invoices
//@route    GET /api/v1/invoices
//@access   Private
exports.getPreviousTaxYearInvoices = asyncHandler( async (req, res, next) => {

    let dates = getPreviousTaxYearDates();

    let response = await datesRangeQuery(req.user.id, Invoice, dates)
    res
        .status(200)
        .json({
            success: true,
            data: response
        })
})


//@desc     Create invoice
//@route    POST /api/v1/invoices
//@access   Private
exports.createInvoice = asyncHandler(async(req,res,next) => {

    const {project, projectTitle, paymentDate, paymentAmount} = req.body;

    const userId = req.user.id;

    if(!project || !projectTitle || !paymentDate || !paymentAmount) {
        return next(new ErrorResponse('Invalid request', 400));
    }

    req.body.paymentDate = setDateOffset(new Date(new Date(paymentDate).setHours(0,0,0,0)))

    let newInvoice = req.body;


    newInvoice.paymentDate = new Date(paymentDate);

    newInvoice.user = userId;




    const foundProject = await Project.findOne({_id: project, user: userId});


    if(!foundProject) {
        return next(new ErrorResponse(`Project not found`, 404))
    }

    if(foundProject.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }


    let invoiceResponse = await Invoice.create(newInvoice)



    await Project.findByIdAndUpdate(invoiceResponse.project, {projectInvoice: invoiceResponse._id}, {
        new: true,
        runValidators: true
    })

    res
        .status(200)
        .json({
            success: true,
            data: invoiceResponse
        })
})






//@desc     Upload invoice file
//@route    PUT /api/v1/invoices/:invoiceId/file
//@access   Private
exports.attachInvoiceFile = asyncHandler(async (req,res, next) => {

    const {invoiceId} = req.params;
    const userId = req.user.id;


    const invoice = await Invoice.findOne({_id: invoiceId, user: userId});

    if(!invoice) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(invoice.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }



    if(!req.files.invoice) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    if(invoice.invoiceFile) {

        try {
            fs.unlinkSync(process.env.FILES_PATH +`/projects-invoices/${invoice.invoiceFile}`)

        } catch (e) {
            console.log(e);
        }
    }


    let file = req.files.invoice;

    if(!file.mimetype.startsWith('image')) {

        if(!file.mimetype.startsWith('application/pdf')) {
            return next(new ErrorResponse('Incorrect file type, The file should be an image or pdf.', 400))
        }


    }

    if(file.size > process.env.FILE_UPLOAD_SIZE) {
        return next(new ErrorResponse('File size is too big. File size should be less than 4Mb', 400))
    }

    let invoiceTimeStamp = new Date(invoice.paymentDate).getTime()

    let invoiceNameParsed = invoice.projectTitle.split(" ").join("_").toLowerCase();

    file.name = `invoice_${invoiceNameParsed}` + '_' + `${invoiceTimeStamp}${path.parse(file.name).ext}`;


    file.mv(`${process.env.FILES_PATH}/projects-invoices/${file.name}`, async error => {
        if(error) {
            return next(new ErrorResponse('Problem with file upload', 500))
        }
    });

    let updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, {invoiceFile: file.name}, {
        new: true,
        runValidators: true
    })

    res
        .status(200)
        .json({
            success: true,
            data: updatedInvoice
        })
})

//@desc     Download invoice for the project
//@route    GET /api/v1/invoices/:invoiceId
//@access   Private
exports.downloadProjectInvoice = asyncHandler(async (req,res, next) => {

    const {invoiceId} = req.params
    const userId = req.user.id;

    const invoice = await Invoice.findOne({_id: invoiceId,user: userId});


    if(!invoice) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(invoice.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }

    const file = `${process.env.FILES_PATH}/projects-invoices/${invoice.invoiceFile}`;

    res.download(file);

})


//@desc     Update invoice
//@route    PUT /api/v1/invoices/:invoiceId
//@access   Private
exports.updateInvoice = asyncHandler(async(req,res,next) => {

    const { project, projectTitle, paymentDate, paymentAmount} = req.body;


    const {invoiceId} = req.params;
    const userId = req.user.id;


    if(!project || !projectTitle || !paymentDate || !paymentAmount) {
        return next(new ErrorResponse('Invalid request', 400));
    }

    let updateInvoice = req.body;

    updateInvoice.paymentDate = setDateOffset(new Date(new Date(paymentDate).setHours(0,0,0,0)));

    updateInvoice.user = req.user.id;

    let foundInvoice = await Invoice.findOne({_id: invoiceId, user: userId});

    if(!foundInvoice) {
        return next(new ErrorResponse(`Resource not found.` , 404));
    }

    if( foundInvoice.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorised request` , 403));
    }

    let updatedInvoice = await Invoice.findByIdAndUpdate(id, updateInvoice, {new: true, runValidators: true})

    res
        .status(200)
        .json({
            success: true,
            data: updatedInvoice
        })
})



//@desc     Delete invoice for the project
//@route    DELETE /api/v1/invoices/:invoiceId
//@access   Private
exports.deleteProjectInvoice = asyncHandler(async (req,res, next) => {

    const userId = req.user.id;
    const {invoiceId} = req.params;
    const invoice = await Invoice.findOne({_id: invoiceId, user: userId});

    if(!invoice) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(invoice.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }

    let project = await Project.findOne({projectInvoice: invoiceId});

    if(project) {
        await Project.findOneAndUpdate(
            {projectInvoice: req.params.invoiceId},
            {projectInvoice: null},
            {runValidators: true}
        )
    }

    invoice.remove();

    res.status(200)
        .json({success: true});

})
