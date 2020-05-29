const {userOneId}  = require('./ids.fixture')
const crypto = require('crypto')


const userOneResetPasswordToken = crypto.randomBytes(20).toString('hex');

//Hashing the reset token
let resetPasswordToken = crypto
    .createHash('sha256')
    .update(userOneResetPasswordToken)
    .digest('hex');

const userOne = {
    _id: userOneId,
    name: 'John Doe',
    email: 'johnd@mymail.com',
    password: 'Fishy1234',
    resetPasswordToken: resetPasswordToken

}

module.exports = {
    userOne,
    userOneResetPasswordToken
}
