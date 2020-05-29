const jwt = require('jsonwebtoken');
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse');

// Import models
const User = require('../models/user.model')

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;



    if(process.env.NODE_ENV === 'development' ||process.env.NODE_ENV === 'testing' ) {
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
    }

    if(process.env.NODE_ENV === 'production') {
        if(req.cookies.token) {
            token = req.cookies.token
        }
    }

    //Make sure that token exist
    if(!token) {
        return next(new ErrorResponse("Unauthorized user", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);
        if(req.user === null) {
            return next(new ErrorResponse('Unauthorized user', 401))
        }
        next();

    } catch(err) {
        return next(new ErrorResponse("Unauthorized user", 401));
    }
})

exports.authorize = (...roles) => {
    return (req,res, next)=> {
        if(!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
        }
        next();
    }
}
