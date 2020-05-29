const express = require('express');
const advancedResults = require('../middleware/advancedGetResults')
const Client =require('../models/client.model')
const {
    createClient,
    updateClient,
    getUserClients,
    getUserClientById,
    deleteClient
} = require('../controllers/client.controller')

const {protect} = require('../middleware/auth')
const router = express.Router()

/**
 *@swagger
 * /api/v1/clients:
 *  post:
 *     summary: Use to create new client.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: body
 *         name: Client object
 *         description: The client to be created.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - user
 *             - incomePlatform
 *           properties:
 *             name:
 *               type: string
 *               example: 'Alice Doe'
 *             user:
 *               type: string
 *               example: '5df0a87966630e1b3a440d64'
 *             incomePlatform:
 *               type: string
 *               example: '5df0a87966630e1b3a440d5a'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful creation of new client.
 *       '400':
 *          description: Bad request, object missing necessary fields.
 *       '401':
 *          description: Not authenticated user.
 *
 *
 *  get:
 *     summary: Use to get list of clients.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of clients.
 *       '401':
 *          description: Not authenticated user.
 */


router
    .route('/')
    .post(protect, createClient)
    .get(protect,advancedResults(Client, 'incomePlatform'), getUserClients)

/**
 *@swagger
 * /api/v1/clients/:clientId:
 *  get:
 *     summary: Use to get a single client.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: Client ID
 *         description: ID of the client to be fetched.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of the client.
 *       '401':
 *          description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *          description: Requested client not found.
 *
 *
 *  put:
 *     summary: Use to update client details.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: Client ID
 *         description: ID of the client to be updated.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful update of client.
 *       '400':
 *          description: Bad request, object missing necessary field.
 *       '401':
 *          description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *          description: Client not found.
 *
 *  delete:
 *     summary: Use to delete client.
 *     tags:
 *       - Clients
 *     parameters:
 *       - in: path
 *         name: Client ID
 *         description: The client ID.
 *         schema:
 *           type: string
 *           example: '5df0a87966630e1b3a440d63'
 *           required: true
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful deletion of the client.
 *       '401':
 *          description: Not authenticated user.
 *       '403':
 *         description: Not authorized user.
 *       '404':
 *          description: Requested client not found.
 */



router
    .route('/:clientId')
    .put(protect,updateClient)
    .get(protect, getUserClientById)
    .delete(protect, deleteClient)

module.exports = router
