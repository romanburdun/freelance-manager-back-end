const router = require('express').Router({mergeParams: true});
const advanceGetResults = require('../middleware/advancedGetResults')
const Project = require('../models/project.model')
const tasksRoute = require('./tasks.router')
const {
    createProject,
    updateProject,
    getProjectById,
    getAllProjects,
    deleteProject,


} = require('../controllers/projects.controller')
const {protect} = require('../middleware/auth');


 router.use('/:projectId/tasks', tasksRoute)

/**
 *@swagger
 * /api/v1/projects:
 *
 *  get:
 *     summary: Use to get projects.
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of expenses.
 *       '401':
 *         description: Not authenticated user.
 *
 *  post:
 *     summary: Use to create new project.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: body
 *         name: New project
 *         description: The project to be created.
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - brief
 *             - startDate
 *             - endDate
 *             - client
 *             - status
 *           properties:
 *             title:
 *               type: string
 *               example: 'Project title'
 *             brief:
 *               type: string
 *               example: 'Brief content'
 *             startDate:
 *               type: string
 *               example: '2019-12-09'
 *             endDate:
 *               type: string
 *               example: '2019-12-09'
 *             client:
 *               type: string
 *               example: '2019-12-09'
 *             status:
 *               type: string
 *               example: 'started'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of new project.
 *       '400':
 *         description: Bad request, object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 */
router
    .route('/')
    .get(protect, advanceGetResults(Project, ['tasks', {path: 'client', select: ['id', 'name' ]}]),  getAllProjects)
    .post(protect,createProject)



/**
 *@swagger
 * /api/v1/projects/:projectId:
 *
 *  get:
 *     summary: Use to get a single project by id.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: project ID
 *         description: ID of the project to be fetched.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of requested project.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Requested project not found.
 *
 *  put:
 *     summary: Use to update project.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: Project ID
 *         description: The project ID.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *       - in: body
 *         name: The updated project
 *         description: The project to be updated.
 *         schema:
 *           type: object
 *           required:
 *             - title
 *             - brief
 *             - startDate
 *             - endDate
 *             - client
 *             - status
 *           properties:
 *             title:
 *               type: string
 *               example: 'Project title'
 *             brief:
 *               type: string
 *               example: 'Brief content'
 *             startDate:
 *               type: string
 *               example: '2019-12-09'
 *             endDate:
 *               type: string
 *               example: '2019-12-09'
 *             client:
 *               type: string
 *               example: '2019-12-09'
 *             status:
 *               type: string
 *               example: 'started'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful update of the project.
 *       '400':
 *         description: Bad request, object missing necessary fields.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *
 *  delete:
 *     summary: Use to delete project by id.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: project ID
 *         description: ID of the project to be deleted.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of the project.
 *       '401':
 *         description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *         description: Requested project not found.
 */

router
    .route('/:projectId')
    .get(protect, getProjectById)
    .put(protect,updateProject)
    .delete(protect, deleteProject)





module.exports = router;
