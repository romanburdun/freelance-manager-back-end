const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {setDateOffset} = require('../utils/datesUtils')
const crypto = require('crypto');
const UserSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            match: [(/^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,12}$/)]
        },
        password: {
            type: String,
            minlength: 8,
            required: [true, "Please add password"],
            select: false
        },
        role: {
            type: String,
            enum: ['user', 'tester'],
            default: 'user',

        },

        resetPasswordToken: String,
        resetPasswordExpire: Date,
        createdAt: {
            type: Date,
            default: Date.now
        }

})

//Encrypt password using bcrypt before persisting the user to the database
UserSchema.pre('save',async function(next) {
    if(!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
})

//Create JWT token
UserSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRY, algorithm: 'HS512'})
}

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

UserSchema.methods.getResetPasswordToken = function() {

    //Generating a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hashing the reset token
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    let now = setDateOffset(new Date());
    this.resetPasswordExpire = new Date(now.getTime() + 10 *60 * 1000)
    this.save();
    return resetToken;
}

module.exports = mongoose.model('User', UserSchema);
