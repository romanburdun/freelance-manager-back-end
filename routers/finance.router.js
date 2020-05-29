const express = require('express');
const {protect} = require('../middleware/auth');
const {getCurrentYearFinanceInfo,
    getCurrentYearExpensesSummary,
    getIncomeByPlatforms,
    getMonthlyIncome,
    getCurrentTaxYearFinance,
    getPreviousTaxYearFinance,
    getSpecifiedTaxYearFinance,
    getPreviousYearExpensesSummary,
    getPreviousYearFinanceInfo
} = require('../controllers/finance.controller');

const router = express.Router()

/**
 *@swagger
 * /api/v1/finance/current-tax-year:
 *  get:
 *     summary: Use to get current tax year finance information.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of current tax year finance information.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/current-tax-year')
    .get(protect,getCurrentYearFinanceInfo)

/**
 *@swagger
 * /api/v1/finance/previous-tax-year:
 *  get:
 *     summary: Use to get previous tax year finance information.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of previous tax year finance information.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/previous-tax-year')
    .get(protect,getPreviousYearFinanceInfo)



/**
 *@swagger
 * /api/v1/finance/current-tax-year/expenses-summary:
 *  get:
 *     summary: Use to get current tax year expenses summary.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of expenses summary for a graphical representation.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/current-tax-year/expenses-summary')
    .get(protect,getCurrentYearExpensesSummary)

/**
 *@swagger
 * /api/v1/finance/previous-tax-year/expenses-summary:
 *  get:
 *     summary: Use to get previous tax year expenses summary.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of expenses summary for a graphical representation.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/previous-tax-year/expenses-summary')
    .get(protect,getPreviousYearExpensesSummary)



/**
 *@swagger
 * /api/v1/finance/platforms-income:
 *  get:
 *     summary: Use to get income categorized by income platform.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of income for a graphical representation.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/platforms-income')
    .get(protect,getIncomeByPlatforms)


/**
 *@swagger
 * /api/v1/finance/monthly-income:
 *  get:
 *     summary: Use to get monthly income breakdown for last 6 months.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of monthly income breakdown for a graphical representation.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/monthly-income')
    .get(protect,getMonthlyIncome)



/**
 *@swagger
 * /api/v1/finance/current-tax-year/archive:
 *  get:
 *     summary: Use to download all invoices and expenses files for current year.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of zip archive.
 *          content:
 *            application/zip:
 *              schema:
 *                type: string
 *                format: binary
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/current-tax-year/archive')
    .get(protect, getCurrentTaxYearFinance)


/**
 *@swagger
 * /api/v1/finance/previous-tax-year/archive:
 *  get:
 *     summary: Use to download all invoices and expenses files for previous year.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of zip archive.
 *          content:
 *            application/zip:
 *              schema:
 *                type: string
 *                format: binary
 *       '401':
 *         description: Not authenticated user.
 */

router
    .route('/previous-tax-year/archive')
    .get(protect, getPreviousTaxYearFinance)

/**
 *@swagger
 * /api/v1/finance/tax-year/:year/archive:
 *  get:
 *     summary: Use to download all invoices and expenses files for specified year.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of zip archive.
 *          content:
 *            application/zip:
 *              schema:
 *                type: string
 *                format: binary
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/tax-year/:year/archive')
    .get(protect, getSpecifiedTaxYearFinance)



module.exports = router;
