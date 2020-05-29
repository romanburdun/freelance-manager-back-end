const Client = require('../models/client.model')
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
//@desc     Create client
//@route    POST /api/v1/clients
//@access   Private
exports.createClient = asyncHandler( async (req,res,next) => {

    const {name, incomePlatform} = req.body;

    if(!name || !incomePlatform) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    req.body.user = req.user.id
    const client = await Client.create(req.body)

    res
        .status(200)
        .json({
            success: true,
            data: client
        })
})


//@desc     Get clients
//@route    GET /api/v1/clients
//@access   Private
exports.getUserClients = asyncHandler( async (req,res,next) => {

    res
        .status(200)
        .json(res.advancedResults)
})

//@desc     Get client by ID
//@route    GET /api/v1/clients/:clientId
//@access   Private
exports.getUserClientById = asyncHandler( async (req,res,next) => {

    const {clientId} = req.params;
    const userId = req.user.id;

    const client = await Client.findOne({_id: clientId, user: userId});


    if(!client) {
        return next(new ErrorResponse(`Resource not found.`, 404))
    }

    if(client.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403));
    }
    res
        .status(200)
        .json({
            success: true,
            data: client
        })
})


//@desc     Update a client by ID
//@route    PUT /api/v1/clients/:clientId
//@access   Private
exports.updateClient = asyncHandler( async (req,res,next) => {

    const {name} = req.body
    if(!name) {
        return next(new ErrorResponse(`Invalid client update request`, 400))
    }

    const {clientId} = req.params;
    const userId = req.user.id;

    const client = await Client.findOne({_id: clientId, user: userId});

    if(!client) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(client.user.toString()!== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403));
    }

    const updatedClient = await Client.findByIdAndUpdate(req.params.clientId, {
        name,
    }, {new: true, runValidators: true})

    res
        .status(200)
        .json({
            success: true,
            data: updatedClient
        })
})

//@desc     Delete client by ID
//@route    DELETE /api/v1/clients/:clientId
//@access   Private
exports.deleteClient = asyncHandler( async (req,res,next) => {

    const {clientId} = req.params;
    const userId = req.user.id;

    const client = await Client.findOne({_id: clientId, user: userId});
    if(!client) {
        return next(new ErrorResponse(`Resource not found`, 404))
    }

    if(client.user.toString() !== userId) {
        return next(new ErrorResponse(`Unauthorized request`, 403));
    }

    client.remove();

    res
        .status(200)
        .json({
            success: true
        })
})
