const Expense = require('../models/expense.model');
const asyncHandler = require('../middleware/async');
const Invoice = require('../models/invoice.model')
const IncomePlatform = require('../models/incomePlatform.model')
const Client = require('../models/client.model')
const taxYear = require('../utils/datesUtils')
const fs = require('fs');
const path = require('path')
const archiver = require('archiver')
const csv = require('../utils/csvWriter');
const ErrorResponse = require('../utils/errorResponse');
const {datesRangeQuery} = require('../utils/queries');


//@desc     Get current year finances information
//@route    GET /api/v1/finance
//@access   Private
exports.getCurrentYearFinanceInfo = asyncHandler( async (req, res, next) => {

    let dates = taxYear.getCurrentTaxYearDates()

    await calculateFinanceTotal(req.user.id,res, dates);
})


//@desc     Get current year finances information
//@route    GET /api/v1/finance
//@access   Private
exports.getPreviousYearFinanceInfo = asyncHandler( async (req, res, next) => {

    let dates = taxYear.getPreviousTaxYearDates();

    await calculateFinanceTotal(req.user.id,res, dates)

})



//@desc     Get list of expenses
//@route    GET /api/v1/finance/expenses-summary
//@access   Private
exports.getCurrentYearExpensesSummary = asyncHandler( async (req, res, next) => {

     let dates = taxYear.getCurrentTaxYearDates();

     await generateExpensesSummary(req.user.id, dates, res);

})

//@desc     Get list of expenses
//@route    GET /api/v1/finance/expenses-summary
//@access   Private
exports.getPreviousYearExpensesSummary = asyncHandler( async (req, res, next) => {

    let dates = taxYear.getPreviousTaxYearDates();

    await generateExpensesSummary(req.user.id, dates, res);
})


//@desc     Get income by income platforms
//@route    GET /api/v1/finance/platforms-income
//@access   Public
exports.getIncomeByPlatforms = asyncHandler( async (req,res,next) => {

    const date = new Date();
    const ips = await IncomePlatform.find()

    let response = {
        labels:[],
        data: []
    };

    const {taxYearStart, taxYearEnd} = taxYear.getCurrentTaxYearDates();

    //For each platform get clients for the currently logged in user
    for (const platform of ips) {
        let totalPlatformIncome = 0;
        const clients = await Client.find({user: req.user.id, incomePlatform: platform._id}).populate('projects')

        //For each client gathered get projects
        for (const client of clients) {
            // For each project assigned to the client
            for (const project of client.projects) {
                // Check if status is delivered and payment date is in range between beginning of the year and current date
                if(project.status === 'delivered') {

                    let invoice = await Invoice.findById(project.projectInvoice)
                    let projectCompletionDate = new Date(project.paymentDate);

                    //Check if project's payment date is in current tax year

                    if(projectCompletionDate.getTime() >= taxYearStart.getTime() &&
                        projectCompletionDate.getTime() < taxYearEnd.getTime()) {

                        if(invoice) {
                            totalPlatformIncome += invoice.paymentAmount;
                        }

                    }
                }
            }
        }


        response.labels.push( platform.platformName);
        response.data.push(totalPlatformIncome);
    }

    res
        .status(200)
        .json({
            success: true,
            data: response

        })
})

//@desc     Get income data for last 6 months
//@route    GET /api/v1/finance/monthly-income
//@access   Private
exports.getMonthlyIncome = asyncHandler( async (req,res,next) => {

    const behindSixMonths = 1000 * 60 * 60 * 24 * 150;
    const date = new Date();
    const behindSixMonthsDate = new Date(date.getTime() - behindSixMonths);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',];

    let clients = await Client.find({user: req.user.id}).populate('projects');

    let response = {
        labels: [],
        data: []
    }

    let month = behindSixMonthsDate.getMonth()

    for(month; month <= date.getMonth(); month++) {
        response.labels.push(months[month]);
        response.data.push(0);
    }

    clients.forEach(client => {
        client.projects.forEach(project => {
            if(project.status==='delivered') {

                let paymentDate = new Date(project.paymentDate);

                let searchMonth = response.labels.find(month => month === months[paymentDate.getMonth()])

                if(searchMonth === undefined) {
                    response.labels.push(months[paymentDate.getMonth()])
                    response.data.push(project.payment)
                } else {
                    let monthIndex = response.labels.indexOf(searchMonth)
                    response.data[monthIndex] += project.payment;
                }
            }
        })
    })

    res
        .status(200)
        .json({
            success: true,
            data: response
        })
})

//@desc     Get expenses for current tax year
//@route    GET /api/v1/finance/current-expenses-report
//@access   Private
exports.getCurrentTaxYearFinance = asyncHandler(async(req, res, next) =>{

    let {taxYearStart, taxYearEnd} = taxYear.getCurrentTaxYearDates();

    const expenses = await Expense.find({user: req.user.id, expenseDate: {$gte: taxYearStart, $lte: taxYearEnd}});
    const invoices = await Invoice.find({user: req.user.id, paymentDate: {$gte: taxYearStart, $lte: taxYearEnd}});
    const documents = {invoices, expenses}



    const zipPath = `${process.env.FILES_PATH}/reports/current-tax-year-finance.zip`;
    const expensesCSVPath = `${process.env.FILES_PATH}/reports/current-tax-year-expenses.csv`;
    const invoicesCSVPath =`${process.env.FILES_PATH}/reports/current-tax-year-invoices.csv`;
    const paths = {zipPath, expensesCSVPath, invoicesCSVPath}

    const expensesFileName = 'current-tax-year-expenses.csv';
    const invoicesFileName ='current-tax-year-invoices.csv';
    const csvFileNames ={ invoicesFileName, expensesFileName}

    await collectDataAndZip(res, paths, documents, csvFileNames, next)


})


//@desc     Get expenses for current tax year
//@route    GET /api/v1/finance/current-expenses-report
//@access   Private
exports.getPreviousTaxYearFinance = asyncHandler(async(req, res, next) =>{

    let {taxYearStart, taxYearEnd} = taxYear.getPreviousTaxYearDates();

    const expenses = await Expense.find({user: req.user.id, expenseDate: {$gte: taxYearStart, $lte: taxYearEnd}});
    const invoices = await Invoice.find({user: req.user.id, paymentDate: {$gte: taxYearStart, $lte: taxYearEnd}});

    const documents = {invoices, expenses}



    const zipPath = `${process.env.FILES_PATH}/reports/previous-tax-year-finance.zip`;
    const expensesCSVPath = `${process.env.FILES_PATH}/reports/previous-tax-year-expenses.csv`;
    const invoicesCSVPath =`${process.env.FILES_PATH}/reports/previous-tax-year-invoices.csv`;
    const paths = {zipPath, expensesCSVPath, invoicesCSVPath}

    const expensesFileName = 'previous-tax-year-expenses.csv';
    const invoicesFileName ='previous-tax-year-invoices.csv';
    const csvFileNames ={ invoicesFileName, expensesFileName}

    await collectDataAndZip(res, paths, documents, csvFileNames, next)

})

exports.getSpecifiedTaxYearFinance = asyncHandler(async (req,res,next) => {



    const year = req.params.year;

    if(!year) {
        return next(new ErrorResponse("Bad request: Tax year not specified", 400))
    }

    let {taxYearStart, taxYearEnd} = taxYear.getSpecifiedTaxYearDates(year);

    const expenses = await Expense.find({user: req.user.id, expenseDate: {$gte: taxYearStart, $lte: taxYearEnd}});
    const invoices = await Invoice.find({user: req.user.id, paymentDate: {$gte: taxYearStart, $lte: taxYearEnd}});

    const documents = {invoices, expenses}



    const zipPath = `${process.env.FILES_PATH}/reports/${year}-tax-year-finance.zip`;
    const expensesCSVPath = `${process.env.FILES_PATH}/reports/${year}-tax-year-expenses.csv`;
    const invoicesCSVPath =`${process.env.FILES_PATH}/reports/${year}-tax-year-invoices.csv`;
    const paths = {zipPath, expensesCSVPath, invoicesCSVPath}

    const expensesFileName = `${year}-tax-year-expenses.csv`;
    const invoicesFileName =`${year}-tax-year-invoices.csv`;
    const csvFileNames ={ invoicesFileName, expensesFileName}

    await collectDataAndZip(res, paths, documents, csvFileNames, next)


})

// Helper methods
const collectDataAndZip = async (res, paths, documents, csvFileNames, next) => {


    const {invoices, expenses} = documents;
    const {expensesCSVPath, invoicesCSVPath, zipPath} = paths;
    const {expensesFileName, invoicesFileName} = csvFileNames;

    if(invoices.length === 0 && expenses.length === 0) {
        return next(new ErrorResponse("No data found", 404))
    }

    let output = fs.createWriteStream(zipPath)
    let archive = archiver('zip', {
        zlib: {level: 7}
    })



    output.on('end', function() {
        console.log('Data has been drained');
    });


    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    let expensesRecords = [];
    expenses.forEach(expense => {

        if(expense.expenseProof) {
            let filePath = `${process.env.FILES_PATH}/expenses-proofs/${expense.expenseProof}`
            archive.append(fs.createReadStream(filePath), {name: expense.expenseProof})
        }

        expensesRecords.push(
            {
                'Expense name:': expense.expenseTitle,
                'Expense date:': expense.expenseDate.toDateString(),
                'Expense payment:': expense.expenseAmount,
                'Expense file:': expense.expenseProof === undefined ? 'not-attached' : expense.expenseProof

            })
    })

    let invoicesRecords = [];

    setTimeout(async ()=> {
        invoices.forEach(invoice => {
            if(invoice.invoiceFile) {
                let filePath = `${process.env.FILES_PATH}/projects-invoices/${invoice.invoiceFile}`
                archive.append(fs.createReadStream(filePath), {name: invoice.invoiceFile})
            }

            invoicesRecords.push(
                {
                    'Invoice project:': invoice.projectTitle,
                    'Invoice date:': invoice.paymentDate.toDateString(),
                    'Invoice payment:': invoice.paymentAmount,
                    'Invoice file:': invoice.invoiceFile === undefined ? 'not-attached' : invoice.invoiceFile

                })

        });




        await  csv.createReport(expensesCSVPath, expensesRecords);

        await  csv.createReport(invoicesCSVPath, invoicesRecords);

        archive.append(fs.createReadStream(expensesCSVPath), {name: expensesFileName});
        archive.append(fs.createReadStream(invoicesCSVPath), {name: invoicesFileName })
        archive.finalize();



        output.on('close', function() {
            res.download(zipPath);
        });
    }, 1000)



}

const calculateFinanceTotal = async (user, res, dates) => {


    const invoices = await datesRangeQuery(user, Invoice, dates);

    const userExpenses = await datesRangeQuery(user, Expense, dates);

    let data={
        totalIncome: 0,
        totalExpenses: 0,
    };


    invoices.forEach(invoice=> {
        data.totalIncome += invoice.paymentAmount
    })


    userExpenses.forEach(expense => {
        data.totalExpenses += expense.expenseAmount
    })

    res
        .status(200)
        .json({
            success: true,
            data: data
        })
}

const generateExpensesSummary = async (user, dates, res) => {


    const expenses = await datesRangeQuery(user, Expense, dates);

    let response = [];

    expenses.forEach(expense => {
        let searchItem = response.find(exp => exp.expenseTitle === expense.expenseTitle)
        if(searchItem === undefined) {
            response.push(
                {
                    expenseTitle: expense.expenseTitle,
                    expenseAmount: expense.expenseAmount
                }
            );
        } else {
            searchItem.expenseAmount += Math.round((searchItem.expenseAmount + expense.expenseAmount) * 100) / 100;
        }
    });

    let chartData = {
        labels: [],
        amount:[]
    }

    response.forEach(exp => {
        chartData.labels.push(exp.expenseTitle);
        chartData.amount.push(exp.expenseAmount);
    })

    res
        .status(200)
        .json({
            success: true,
            data: chartData
        })
}