const express = require('express')
const { createTask,
    deleteTask,
    bulkUpload
} = require('../controllers/tasks.controller')
const {protect} = require('../middleware/auth')
const router = express.Router({mergeParams: true});

/**
 *@swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Use to create a task for a project.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: body
 *         name: Task
 *         description: The task to be created.
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - project
 *           properties:
 *             title:
 *               type: string,
 *               example: 'Task title'
 *             project:
 *               type: string
 *               example: 'projectId'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of new task.
 *       '400':
 *         description: Bad request object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 *
 */

router
    .route('/')
    .post(protect, createTask)

/**
 *@swagger
 * /api/v1/tasks/:projectId/bulk:
 *   post:
 *     summary: Use to create multiple tasks for a project.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: body
 *         name: tasks array
 *         description: Array of tasks to be created for a project.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - title
 *               - project
 *             properties:
 *               title:
 *                 type: string,
 *                 example: 'Task title'
 *               project:
 *                 type: string
 *                 example: 'projectId'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of tasks.
 *       '400':
 *         description: Bad request object missing necessary fields or invalid.
 *       '401':
 *         description: Not authenticated user.
 *
 */

router
    .route('/:projectId/bulk')
    .post(protect, bulkUpload)



/**
 *@swagger
 * /api/v1/tasks/:taskId:
 *   delete:
 *     summary: Use to delete the task.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: Task ID
 *         description: ID of the task to be deleted.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of the task.
 *       '401':
 *          description: Not authenticated user.
 *       '404':
 *         description: Requested task not found.
 */
router
    .route('/:taskId')

    .delete(protect, deleteTask)

module.exports = router;
