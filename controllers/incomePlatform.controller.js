const IncomePlatform = require('../models/incomePlatform.model');
const asyncHandler = require('../middleware/async')
const ErrorResponse = require('../utils/errorResponse')
const Client = require('../models/client.model')

//@desc     Get income platforms
//@route    GET /api/v1/ips
//@access   Public
exports.getIncomePlatforms = asyncHandler( async (req,res,next) => {

    const ips = await IncomePlatform.find()

    const clients = await Client.find({user: req.user.id})

    let response = [];

    //Getting number of clients and projects for each platform
    ips.forEach(platform => {
        let updatedPlatform = platform.toObject();
        updatedPlatform.projects = 0;
        updatedPlatform.clients = 0;
        let filteredClients = clients.filter(client => client.incomePlatform._id.toString() === platform._id.toString())

        updatedPlatform.clients = filteredClients.length;

        filteredClients.forEach(client => {
            updatedPlatform.projects+=client.projects.length;
        })

        response.push(updatedPlatform);
    })


    res
        .status(200)
        .json({
            success: true,
            count: ips.length,
            data: response
        })
})

//@desc     Create income platform
//@route    POST /api/v1/ips
//@access   Private
exports.createIncomePlatform = asyncHandler( async (req,res,next) => {

    const {platformName} = req.body;

    if(!platformName) {
        return next( new ErrorResponse(`Invalid request`, 400))
    }

    const ip = await IncomePlatform.create({platformName})

    ip.clients = 0;
    ip.projects = 0;

    res
        .status(200)
        .json({
            success: true,
            data: ip
        })
})




//@desc     Get income platform by ID
//@route    GET /api/v1/ips/:ipId
//@access   Public
exports.getIncomePlatform = asyncHandler( async (req,res,next) => {

    const ip = await IncomePlatform.findById(req.params.ipId);


    if(!ip) {
        return next(new ErrorResponse("Resource not found", 404))
    }

    res
        .status(200)
        .json({
            success: true,
            data: ip
        })
})

//@desc     Update an income platform by ID
//@route    PUT /api/v1/ips/:ipId
//@access   Private
exports.updateIncomePlatform = asyncHandler( async (req,res,next) => {

    const {platformName} = req.body;

    if(!platformName) {
        return next(new ErrorResponse(`Invalid request`, 400))
    }

    const foundPlatform = await IncomePlatform.findById(req.params.ipId);

    if(!foundPlatform) {
        return next(new ErrorResponse(`Income platform not found`, 404))
    }



    const ip = await IncomePlatform.findByIdAndUpdate(req.params.ipId, {platformName}, {
        new: true,
        runValidators: true
    })

    res
        .status(200)
        .json({
            success: true,
            data: ip
        })
})


//@desc     Delete income platform by ID
//@route    DELETE /api/v1/ips/:ipId
//@access   Private
exports.deleteIncomePlatform = asyncHandler( async (req,res,next) => {

    const platform = await IncomePlatform.findById(req.params.ipId);

    if(!platform) {
        return next(new ErrorResponse('Resource not found', 404))
    }

        platform.remove();

    res
        .status(200)
        .json({
            success: true
        })
})

