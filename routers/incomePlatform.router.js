const express = require("express")
const {protect} = require('../middleware/auth')
const {
    createIncomePlatform,
    updateIncomePlatform,
    getIncomePlatforms,
    getIncomePlatform,
    deleteIncomePlatform
} = require('../controllers/incomePlatform.controller')

const router = express.Router()






/**
 *@swagger
 * /api/v1/ips:
 *
 *   get:
 *     summary: Use to get all created income platforms.
 *     tags:
 *       - Income platforms
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of income platforms.
 *       '401':
 *         description: Not authenticated user.
 *
 *   post:
 *     summary: Use to create new income platform.
 *     tags:
 *       - Income platforms
 *     parameters:
 *       - in: body
 *         name: Income platform
 *         description: The income platform to be created.
 *         schema:
 *           type: object
 *           required:
 *             - platformName
 *           properties:
 *             platformName:
 *               type: string,
 *               example: 'Income Platform'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of new income platform.
 *       '400':
 *          description: Bad request, object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 *
 */
router
    .route('/')
    .get(protect, getIncomePlatforms)
    .post(protect, createIncomePlatform)

/**
 *@swagger
 * /api/v1/ips/:ipId:
 *
 *   get:
 *     summary: Use to fetch income platform by ID.
 *     tags:
 *       - Income platforms
 *     parameters:
 *       - in: path
 *         name: Income platform ID
 *         description: ID of the income platform to be fetched.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of income platform by ID.
 *       '401':
 *         description: Unauthenticated user.
 *       '404':
 *         description: Income platform not found.
 *
 *   put:
 *     summary: Use to update income platform.
 *     tags:
 *       - Income platforms
 *     parameters:
 *       - in: path
 *         name: Income platform ID
 *         description: ID of income platform to be updated.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *       - in: body
 *         name: Income platform
 *         description: The update object.
 *         schema:
 *           type: object
 *           required:
 *             - platformName
 *           properties:
 *            platformName:
 *               type: string,
 *               example: 'Updated platform name'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful update of income platform.
 *       '400':
 *          description: Bad request, object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 *       '404':
 *          description: Income platform not found.
 *
 *   delete:
 *     summary: Use to delete income platform by ID.
 *     tags:
 *       - Income platforms
 *     parameters:
 *       - in: path
 *         name: Income platform ID
 *         description: ID of the income platform to be deleted.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of income platform by ID.
 *       '401':
 *         description: Unauthenticated user.
 *       '404':
 *         description: Income platform not found.
 *
 */


router
    .route('/:ipId')
    .get(protect, getIncomePlatform)
    .put(protect, updateIncomePlatform)
    .delete(protect, deleteIncomePlatform)


module.exports = router
