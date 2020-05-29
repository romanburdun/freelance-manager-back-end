const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse')
const User = require('../models/user.model')
const crypto = require('crypto');
const fmMailer = require('../utils/nodeMailer')
const {sendGridMail} = require("../utils/sendGrid")
const {setDateOffset} = require('../utils/datesUtils')
//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
exports.registerUser = asyncHandler( async (req,res,next) => {

    const {name, email, password, role} = req.body;

    if(!name || !email || !password) {
        return next(new ErrorResponse("Invalid request for registering the user", 400))
    }

    const searchUserByEmail = await User.findOne({email: email})
    const searchUserByName = await User.findOne({name: name})

    if(searchUserByEmail || searchUserByName) {
        return next(new ErrorResponse('User with provided email or user name already exists', 409))
    }

    const user = await User.create({name, email, password, role})

    sendTokenResponse(user, 200, res)

})

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
exports.loginUser = asyncHandler( async (req,res,next) => {

    const {email, password} = req.body

    if(!email || !password) {
        return next(new ErrorResponse("Invalid request", 400))
    }

    const user = await User.findOne({email}).select('+password')

    if(!user) {
        return next(new ErrorResponse('Invalid username or password', 404))
    }


    const isMatch = await user.matchPassword(password)

    if(!isMatch) {
        return next(new ErrorResponse('Invalid username or password', 404));
    }

    await sendTokenResponse(user, 200, res);
});


//@desc     Logout user and clear cookies
//@route    GET /api/v1/auth/logout
//@access   Private
exports.logoutUser = asyncHandler( async (req,res,next) => {

    res
        .cookie('token', 'none',{
        httpOnly: true,
        domain: process.env.DOMAIN,
        maxAge: 0,
        overwrite: true
    })

    res.status(200).json({
        success: true,
        message: "You have been logged out."
    })

});


//@desc     Get user profile
//@route    GET /api/v1/auth/me
//@access   Private
exports.myProfile = asyncHandler( async (req,res,next) => {

    if(!req.user) {
        return next(new ErrorResponse('Unauthenticated request', 401))
    }

    let profile = await User.findById(req.user).select(['name', 'email']);

    if(!profile) {
        return next(new ErrorResponse('User not found', 404))
    }

    res
        .status(200)
        .json({
            success: true,
            data: profile
        })
})


//@desc     Update user details
//@route    PUT /api/v1/auth/update_user
//@access   Private
exports.updateUser = asyncHandler( async (req,res,next) => {

    if(!req.user) {
        return next(new ErrorResponse('Unauthenticated request', 401))
    }

    const {newName, newEmail, newPassword, currentPassword} = req.body;

    if(!currentPassword) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    let profile = await User.findById(req.user).select('+password');

    if(!profile) {
        return next(new ErrorResponse('Resource not found', 404))
    }


    const isMatch = await profile.matchPassword(currentPassword)

    if(!isMatch) {
        return next(new ErrorResponse('Unauthorized user request', 403));
    }


    let updateObject = {
        name: profile.name,
        email: profile.email,
    };

    if (newName !== null && newName !== '' && newName !== undefined) {
        updateObject.name = newName;
    }

    if(newEmail !== null && newEmail !== '' && newEmail !== undefined) {
       updateObject.email = newEmail
    }



    if(newPassword !== null && newPassword !== '' && newPassword !== undefined) {
        profile.password = newPassword;
        await profile.save({validateBeforeSave: false})
    }

    let updated = await User.findByIdAndUpdate(req.user, updateObject, {
        new: true,
        runValidators: true
    })


    res
        .status(200)
        .json({
            success: true,
            data: updated
        })
})

//@desc     Forgot password request
//@route    POST /api/v1/auth/forgot_password
//@access   Public
exports.forgotPassword = asyncHandler( async (req,res,next) => {

    if(!req.body.email) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    let user = await User.findOne({email: req.body.email});

    if(!user) {
        return next(new ErrorResponse('Resource not found', 404))
    }

    let resetToken = user.getResetPasswordToken();

    //Reset URL

    const resetURL = `${req.protocol}://${process.env.DOMAIN}${process.env.PASSWORD_RESET_URL}${resetToken}`;

    const resetPasswordEmail = `If you have requested password reset for your account please click on the link and follow instructions. 
    \n \n ${resetURL}`;

    const options = {
        email: user.email,
        subject: 'Password reset email instructions.',
        message: resetPasswordEmail
    }

    if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
        try {
            await fmMailer(options)
            res
                .status(200)
                .json({
                    success: true,
                    message: 'Email to reset password was sent to the requested email address'
                })
        } catch (e) {

            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({validateBeforeSave: false});

            return next(new ErrorResponse('Something went wrong in attempt to send an email.', 500))
        }
    }

    if(process.env.NODE_ENV === 'production') {
        try {
            await sendGridMail(user.name, user.email, resetURL)

            res
                .status(200)
                .json({
                    success: true,
                    message: 'Email to reset password was sent to the requested email address'
                })
        } catch (e) {
            console.log(e);
            user.resetPasswordToken = undefined
            user.resetPasswordExpire = undefined
            await user.save({validateBeforeSave: false});

            return next(new ErrorResponse('Something went wromng in attempt to send an email.', 500))

        }
    }

})

//@desc     Reset password for the user
//@route    PUT /api/v1/auth/reset_password/:resetToken
//@access   Private
exports.passwordReset = asyncHandler( async (req,res,next) => {

    let hashedResetToken = crypto
        .createHash('sha256')
        .update(req.params.resetToken)
        .digest('hex')

    let user = await User.findOne({
        resetPasswordToken: hashedResetToken
    })

    if(!user) {
        return next(new ErrorResponse('Invalid token', 404))
    }

    const {newPassword} = req.body;

    if(!newPassword) {
        return next(new ErrorResponse('Invalid request', 400))
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    const resetPasswordEmail = `Password has been successfully reset`;

    const options = {
        email: user.email,
        subject: 'Password has been successfully reset.',
        message: resetPasswordEmail
    }

    try {
        await fmMailer(options)

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false});
    } catch (e) {

        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({validateBeforeSave: false});

        return next(new ErrorResponse('Something went wrong in attempt to send an email.', 500))
    }

    res
        .status(200)
        .json({
            success: true
        })
})


//Helpers

//Get token from model, create cookie and send response
const sendTokenResponse = async (user, statusCode, res) => {
    
    const token = user.getSignedJwtToken();

    const options = {
        maxAge: process.env.COOKIES_MAX_AGE,
        httpOnly: true,
        domain: process.env.DOMAIN,
        secure: false,
        overwrite: true
    };

    if(process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
        })
}
