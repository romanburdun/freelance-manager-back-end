const Expense = require('../models/expense.model')
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const path = require('path')
const fs = require('fs');
const {setDateOffset, getPreviousTaxYearDates} = require('../utils/datesUtils')
const {datesRangeQuery} = require('../utils/queries')
//@desc     Create expense
//@route    POST /api/v1/expenses
//@access   Private
exports.createExpense = asyncHandler(async (req,res, next) => {

    const { expenseDate, expenseTitle, expenseAmount} = req.body

    if(!expenseTitle, !expenseDate, !expenseAmount) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    req.body.expenseDate = setDateOffset(new Date(new Date(expenseDate).setHours(0,0,0,0)))

    req.body.user = req.user.id

    const expense = await Expense.create(req.body)


    res
        .status(200)
        .json({
            success: true,
            data: expense
        })
})



//@desc     Get current tax year expenses
//@route    GET /api/v1/expenses
//@access   Private
exports.getCurrentYearExpenses = asyncHandler( async (req, res, next) => {


    res
        .status(200)
        .json(res.advancedResults)
})

//@desc     Get previous tax year expenses
//@route    GET /api/v1/expenses/previous-tax-year
//@access   Private
exports.getPreviousYearExpenses = asyncHandler( async (req, res, next) => {

    let dates = getPreviousTaxYearDates();

    let response = await datesRangeQuery(req.user.id, Expense, dates);
    res
        .status(200)
        .json({
            success:true,
            data: response
        })
})


//@desc     Upload proof for expense
//@route    POST /api/v1/expenses/:expenseId/proof
//@access   Private
exports.attachExpenseProof = asyncHandler(async (req,res, next) => {

    const {expenseId} = req.params;
    const userId = req.user.id

    const expense = await Expense.findOne({_id: expenseId, user: userId});

    if(!expense) {
        return next(new ErrorResponse(`Expense with ${expenseId}`, 404))
    }

    if(expense.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }

    if(!req.files.proof) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    let file = req.files.proof;

    if(!file.mimetype.startsWith('image')) {

        if(!file.mimetype.startsWith('application/pdf')) {
            return next(new ErrorResponse('Incorrect file type, The file should be an image or pdf.', 400))
        }


    }

    if(file.size > process.env.FILE_UPLOAD_SIZE) {
        return next(new ErrorResponse('File size is too big. File size should be less than 4Mb', 400))
    }

    if(expense.expenseProof) {
        try {
            fs.unlinkSync(process.env.PROOF_FILE_PATH +`/${expense.expenseProof}`)

        } catch (e) {
            console.log(e);
        }
    }

    let expenseTimeStamp = new Date(expense.expenseDate).getTime()

    let expenseNameParsed = expense.expenseTitle.split(" ").join("_").toLowerCase();

    file.name = `expense_${expenseNameParsed}` + '_' + `${expenseTimeStamp}${path.parse(file.name).ext}`;



    file.mv(`${process.env.FILES_PATH}/expenses-proofs/${file.name}`, async error => {
        if(error) {

            return next(new ErrorResponse('Problem with file upload', 500))
        }
    });

    let updatedExpense = await Expense.findByIdAndUpdate(req.params.expenseId, {expenseProof: file.name}, {
        new: true,
        runValidators: true
    })

    res
        .status(200)
        .json({
            success: true,
            data: updatedExpense
        })
})


//@desc     Download proof for expense
//@route    GET /api/v1/expenses/:expenseId/proof
//@access   Private
exports.downloadExpenseProof = asyncHandler(async (req,res, next) => {

    const {expenseId} = req.params;
    const userId = req.user.id

    const expense = await Expense.findOne({_id: expenseId, user: userId});

    if(!expense) {
        return next(new ErrorResponse(`Resource with ${expenseId} not found`, 404))
    }

    if(expense.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403))
    }


    const file = `${process.env.FILES_PATH}/expenses-proofs/${expense.expenseProof}`;

    res.download(file);

})


//@desc     Update expense by ID
//@route    PUT  /api/v1/expenses/:expenseId
//@access   Private
exports.updateExpense = asyncHandler(async (req,res, next) => {

    let {expenseTitle, expenseDate, expenseAmount} = req.body;

    if(!expenseTitle || !expenseDate || !expenseAmount ) {
        return next(new ErrorResponse("Invalid request for updating an expense", 400))
    }

    expenseDate = setDateOffset(new Date(new Date(expenseDate).setHours(0,0,0,0)));

    const updateObject = {
        expenseTitle,
        expenseDate,
        expenseAmount
    }


    const {expenseId} = req.params;
    const userId = req.user.id

    const expense = await Expense.findOne({_id: expenseId, user: userId});

    if(!expense) {
        return next(new ErrorResponse(`Resource with ${expenseId} id not found.`))
    }

    if(expense.user.toString() !== userId) {
        return next(new ErrorResponse("Unauthorized request to update expense", 403))
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.expenseId, updateObject, {
        new: true,
        runValidators: true
    })

    res
        .status(200)
        .json({
            success: true,
            data: updatedExpense
        })
})



//@desc     Delete expense by ID
//@route    DELETE  /api/v1/expenses/:expenseId
//@access   Private
exports.deleteExpense = asyncHandler( async (req,res,next) => {

    const {expenseId} = req.params;
    const userId = req.user.id

    const expense = await Expense.findOne({_id: expenseId, user: userId});

    if(!expense) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(req.user.id !== expense.user.toString()) {
        return next(new ErrorResponse("Unauthorized request to delete expense", 403))
    }

    const deletedExpense = await Expense.findByIdAndRemove(expenseId);

    if(expense.expenseProof) {
        try {
            fs.unlinkSync(`${process.env.FILES_PATH}/expenses-proofs/${expense.expenseProof}`)

        } catch (e) {
            console.log(e);
        }
    }

    res
        .status(200)
        .json({
            success: true,
            data: deletedExpense
        })
})

//@desc     Get list of existing expenses namings
//@route    GET /api/v1/expenses/options-list
//@access   Private
exports.getExpensesList = asyncHandler( async (req,res,next) => {

    const expenses = await Expense.find({user: req.user.id});

    let expenseList = [];

    expenses.forEach(expense => {
        let searchItem = expenseList.find(exp => exp === expense.expenseTitle)
        if(searchItem === undefined) {
            expenseList.push(expense.expenseTitle)
        }
    })
    res
        .status(200)
        .json({
            success: true,
            data: expenseList
        })
})

