const express = require('express')
const {protect} = require('../middleware/auth')
const {
    createExpense,
    updateExpense,
    getCurrentYearExpenses,
    deleteExpense,
    getExpensesList,
    attachExpenseProof,
    downloadExpenseProof,
    getPreviousYearExpenses
} = require('../controllers/expense.controller');

const advancedResults = require('../middleware/advancedGetResults')
const Expense = require('../models/expense.model')
const router = express.Router();

/**
 *@swagger
 * /api/v1/expenses:
 *   post:
 *     summary: Use to create new expense.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: body
 *         name: Expense object
 *         description: The expense to be created.
 *         schema:
 *           type: object
 *           required:
 *             - expenseTitle
 *             - expenseAmount
 *             - expenseDate
 *             - expenseProof
 *             - user
 *           properties:
 *             expenseTitle:
 *               type: string,
 *               example: 'Domain name service'
 *             expenseAmount:
 *               type: number
 *               example: '12'
 *             expenseDate:
 *               type: string
 *               example: '2019-08-12'
 *             user:
 *               type: string
 *               example: '5df0a87966630e1b3a440d64'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of new expense.
 *       '400':
 *          description: Bad request, object has missing necessary fields.
 *       '401':
 *          description: Not authenticated user.
 *   get:
 *     summary: Use to get current tax year expenses for logged in user.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of expenses.
 *       '401':
 *         description: Not authenticated user.
 *
 */

router
    .route('/')
    .post(protect, createExpense)
    .get(protect, advancedResults(Expense), getCurrentYearExpenses)



/**
 *@swagger
 * /api/v1/expenses:
 *   get:
 *     summary: Use to get previous tax year expenses for logged in user.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of expenses.
 *       '401':
 *         description: Not authenticated user.
 *
 */
router
    .route('/previous-tax-year')
    .get(protect, getPreviousYearExpenses)


/**
 *@swagger
 * /api/v1/expenses/:expenseId/proof:
 *   put:
 *     summary: Use to upload expense proof.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: Expense ID
 *         description: The expense ID.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                filename:
 *                  type: string
 *                  format: binary
 *     responses:
 *       '200':
 *         description: Proof successfully uploaded.
 *       '400':
 *         description: No file selected or not supported file type.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Expense wih requested id not exists.
 *       '500':
 *         description: Unable to persist file to the file system.
 *
 *   get:
 *     summary: Use to download expense's proof.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: Expense ID
 *         description: ID of expense to be fetched.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful download of expense file.
 *          content:
 *            application/pdf:
 *              schema:
 *                type: string
 *                format: binary
 *            image/jpeg:
 *              schema:
 *                type: string
 *                format: binary
 *            image/png:
 *              schema:
 *                type: string
 *                format: binary
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Proof file not found.
 */


router
    .route('/:expenseId/proof')
    .put(protect,attachExpenseProof)
    .get(protect, downloadExpenseProof)


/**
 *@swagger
 * /api/v1/expenses/:expenseId:
 *   put:
 *     summary: Use to update requested expense.
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: Update expense ID
 *         description: ID of expense
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *       - in: body
 *         name: Updating of expense
 *         description: The expense to be updated.
 *         schema:
 *           type: object
 *           required:
 *             - expenseTitle
 *             - expenseAmount
 *             - expenseDate
 *             - expenseProof
 *             - user
 *           properties:
 *             expenseTitle:
 *               type: string,
 *               example: 'Domain name'
 *             expenseAmount:
 *               type: number
 *               example: '12'
 *             expenseDate:
 *               type: string
 *               example: '2019-08-12'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful update of expense.
 *       '400':
 *          description: Bad request, object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *   delete:
 *     summary: Use to delete expense by ID
 *     tags:
 *       - Expenses
 *     parameters:
 *       - in: path
 *         name: Expense ID
 *         description: ID of expense to be deleted.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of expense by ID.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Requested expense not found.
 *
 */


router
    .route('/:expenseId')
    .put(protect, updateExpense)
    .delete(protect, deleteExpense)

/**
 *@swagger
 * /api/v1/expenses/options-list:
 *  get:
 *     summary: Use to get expenses options.
 *     tags:
 *       - Expenses
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of expenses options.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/options-list')
    .get(protect,getExpensesList)

module.exports = router;
