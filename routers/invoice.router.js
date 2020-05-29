const router = require('express').Router();
const advancedResults = require('../middleware/advancedGetResults')
const {createInvoice,
    getCurrentTaxYearInvoices,
    downloadProjectInvoice,
    deleteProjectInvoice,
    updateInvoice,
    attachInvoiceFile,
    getPreviousTaxYearInvoices
} = require('../controllers/invoices.controller');
const Invoice = require('../models/invoice.model');
const {protect} = require('../middleware/auth');

/**
 *@swagger
 * /api/v1/invoices:
 *
 *   get:
 *     summary: Use to fetch current tax year invoices.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetch of invoices.
 *       '401':
 *         description: Not authenticated user.
 *       '404':
 *         description: Invoice file not found.
 *
 *   post:
 *     summary: Use to create invoice for a project.
 *     tags:
 *       - Finance
 *     responses:
 *       '200':
 *         description: Invoice successfully created.
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *
 */


router
    .route('/')
    .post(protect,createInvoice)
    .get(protect, advancedResults(Invoice), getCurrentTaxYearInvoices)


/**
 *@swagger
 * /api/v1/invoices/previous-tax-year:
 *
 *   get:
 *     summary: Use to fetch previous tax year invoices.
 *     tags:
 *       - Finance
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetch of invoices.
 *       '401':
 *         description: Not authenticated user.
 *       '404':
 *         description: Invoice file not found.
 *
 *   post:
 *     summary: Use to create invoice for a project.
 *     tags:
 *       - Finance
 *     responses:
 *       '200':
 *         description: Invoice successfully created.
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Not authenticated user.
 *
 */


router
    .route('/previous-tax-year')

    .get(protect,getPreviousTaxYearInvoices)


/**
 *@swagger
 * /api/v1/invoices/:invoiceId/file:
 *   put:
 *     summary: Use to attach invoice file to project's invoice.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: path
 *         name: Invoice ID
 *         description: ID of invoice to be updated with a file attachment.
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
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful invoice file upload.
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
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Invoice file not found.
 *
 */
router
    .route("/:invoiceId/file")
    .put(protect, attachInvoiceFile)

/**
 *@swagger
 * /api/v1/invoices/:invoiceId:
 *   get:
 *     summary: Use to fetch project's invoice.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: path
 *         name: Invoice ID
 *         description: Fetch invoice by ID.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successfully fetched invoice data.
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
 *       '400':
 *         description: Bad request.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Invoice not found.
 *
 *   put:
 *     summary: Use to update project's invoice.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: path
 *         name: Invoice ID
 *         description: ID of invoice to be delete.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful invoice update.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Invoice not found.
 *
 *   delete:
 *     summary: Use to delete project's invoice.
 *     tags:
 *       - Finance
 *     parameters:
 *       - in: path
 *         name: Invoice ID
 *         description: ID of invoice to be delete.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of invoice.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Invoice not found.
 *
 */
router
    .route('/:invoiceId')
    .get(protect,downloadProjectInvoice)
    .put(protect, updateInvoice)
    .delete(protect, deleteProjectInvoice)

module.exports = router;
