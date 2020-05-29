const express = require('express');
const {createSession,
    deleteSession,
    getProductivityTrends
} = require('../controllers/session.controller')
const {protect} = require('../middleware/auth')
const router = express.Router();

/**
 *@swagger
 * /api/v1/sessions:
 *
 *  post:
 *     summary: Use to create a new productivity session.
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: body
 *         name: Session object
 *         description: The session to be created.
 *         schema:
 *           type: object
 *           required:
 *             - sessionDate
 *             - sessionStart
 *             - sessionEnd
 *             - tasks
 *           properties:
 *             sesionDate:
 *               type: string
 *               example: '2019-12-04'
 *             sessionStart:
 *               type: string
 *               example: '2019-12-04 13:05:00.88'
 *             sessionEnd:
 *               type: string
 *               example: '2019-12-04 13:30:00.88'
 *             tasks:
 *               type: array
 *               items:
 *                 type: string
 *                 example: taskId
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of new session.
 *       '400':
 *         description: Bad request object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 *
 */

router
    .route('/')
    .post(protect, createSession);


/**
 *@swagger
 * /api/v1/sessions/:sessionId:
 *
 *  delete:
 *     summary: Use to delete session.
 *     tags:
 *       - Sessions
 *     parameters:
 *       - in: path
 *         name: Session ID
 *         description: ID of the session to be deleted.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of the session.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Requested project not found.
 *
 */

router
    .route('/:sessionId')
    .delete(protect, deleteSession);


/**
 *@swagger
 * /api/v1/sessions/trends:
 *  get:
 *     summary: Use to get productivity trends.
 *     tags:
 *       - Sessions
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: A successful fetching of productivity trends.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/trends')
    .get(protect, getProductivityTrends);


module.exports = router;
