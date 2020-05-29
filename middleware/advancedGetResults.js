const Invoice = require('../models/invoice.model');
const Expense = require('../models/expense.model');
const mongoose = require('mongoose')
const {getCurrentTaxYearDates} = require('../utils/datesUtils')
const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    //Copy req.query
    const userId = {
        user: req.user.id
    }
    let reqQuery = { ...req.query, user: req.user.id}


    const modelCollectionName = model.collection.collectionName;
    if(model.hasOwnProperty('schema') && modelCollectionName === 'invoices') {
        const {taxYearStart, taxYearEnd} = getCurrentTaxYearDates()

        let paymentDate = {gte: taxYearStart, lte: taxYearEnd}

        reqQuery = { ...reqQuery, paymentDate}
    }

    if(model.hasOwnProperty('schema') &&  modelCollectionName === 'expenses') {
        const {taxYearStart, taxYearEnd} = getCurrentTaxYearDates()

        let expenseDate = {gte: taxYearStart, lte: taxYearEnd}

        reqQuery = { ...reqQuery, expenseDate}
    }

    let removeFields = ['select', 'sort', 'page', 'limit'];

    //Loop over remove fields and remove queries matching each field
    removeFields.forEach(param => delete reqQuery[param]);

    //Creating Query String
    let queryStr = JSON.stringify(reqQuery);

    //Creating operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lte|lt|in)\b/g,match => `$${match}`);


    //Finding resource
    query = model.find(JSON.parse(queryStr));


    //Select fields
    if(req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields)
    }

    if(req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page -1) * limit;
    const endIndex = page * limit;

    query = query.skip(startIndex).limit(limit);

    if(populate) {
        query = query.populate(populate)
    }

    //Executing a query
    const results = await query;

    const total = await results.length;
    const totalPages = Math.ceil(total / limit)

    //Pagination result
    const pagination = {};

    if(endIndex < total) {
        pagination.next = {
            page: page +1,
            limit
        }
    }

    if(startIndex > 0 ) {
        pagination.prev = {
            page: page -1,
            limit
        }
    }

    res.advancedResults = {
        success: true,
        total: total,
        totalPages: totalPages,
        pagination,
        data: results

    }
    next();
}
module.exports = advancedResults;
