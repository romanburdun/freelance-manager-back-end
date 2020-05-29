const express = require('express');
const {
    registerUser,
    loginUser,
    logoutUser,
    myProfile,
    forgotPassword,
    passwordReset,
    updateUser
} = require('../controllers/auth.controller')
const {protect} = require('../middleware/auth')
const router = express.Router();

/**
 *@swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Use to register new user.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: New user
 *         description: The user to be created.
 *         schema:
 *           type: object
 *           required:
 *             - name
 *             - email
 *             - password
 *           properties:
 *             name:
 *               type: string,
 *               example: 'John Doe'
 *             email:
 *               type: string
 *               example: 'johndoe@test.com'
 *             password:
 *               type: string
 *               example: 'password123'
 *     responses:
 *       '200':
 *          description: Successful registration of the user.
 *       '400':
 *          description: Bad request, not all necessary fields provided.
 *       '409':
 *          description: User Already exists.
 *
 */
router
    .route('/register')
    .post(registerUser)


/**
 *@swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Use to log in user.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: Credentials
 *         description: The user to be logged in.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               example: 'johndoe@test.com'
 *             password:
 *               type: string
 *               example: 'password123'
 *     responses:
 *       '200':
 *          description: Successful login of the user.
 *       '400':
 *          description: Bad request, email or password fields are missing.
 *       '404':
 *          description: User not found.
 */
router
    .route('/login')
    .post(loginUser)



/**
 *@swagger
 * /api/v1/auth/logout:
 *  get:
 *     summary: Use to log out user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful log out of the user.
 *
 */
router
    .route('/logout')
    .get(logoutUser)


/**
 *@swagger
 * /api/v1/auth/me:
 *  get:
 *     summary: Use to get user's profile.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *          description: Successful fetching of user's profile.
 *       '401':
 *          description: Not authenticated user.
 */
router
    .route('/me')
    .get(protect,myProfile)

/**
 *@swagger
 * /api/v1/auth/update_user:
 *   put:
 *     summary: Use to update user.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: Updated user data
 *         description: The user data to be updated.
 *         schema:
 *           type: object
 *           required:
 *             - newName
 *             - newEmail
 *             - newPassword
 *             - currentPassword
 *           properties:
 *             name:
 *               type: string,
 *               example: 'John Doe'
 *             email:
 *               type: string
 *               example: 'johndoe@test.com'
 *             password:
 *               type: string
 *               example: 'password123'
 *     responses:
 *       '200':
 *          description: Successful update of the user.
 *       '400':
 *          description: Bad request, not all necessary fields provided.
 *       '409':
 *          description: User Already exists.
 *
 */
router
    .route('/update_user')
    .put(protect, updateUser)


/**
 *@swagger
 * /api/v1/auth/forgot_password:
 *  post:
 *     summary: Use to send email with reset token URL to reset password.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: body
 *         name: Object with an email to reset password
 *         description: The user email to get reset password token URL.
 *         schema:
 *           type: object
 *           required:
 *             - email
 *           properties:
 *             email:
 *               type: string
 *               example: 'johndoe@test.com'
 *     responses:
 *       '200':
 *          description: Successful sending of reset password email.
 *       '400':
 *          description: Bad request, email field is missing.
 *
 */
router
    .route('/forgot_password')
    .post(forgotPassword)

/**
 *@swagger
 * /api/v1/auth/reset_password/:resetToken:
 *  put:
 *     summary: Use to reset password for the user.
 *     tags:
 *       - Authentication
 *     parameters:
 *       - in: path
 *         name: Reset token
 *         description: Generated reset token sent to user's email address.
 *         schema:
 *           type: string
 *           required: true
 *           example: 'reset token'
 *       - in: body
 *         name: New password
 *         description: The user's new password.
 *         schema:
 *           type: object
 *           required:
 *             - newPassword
 *           properties:
 *             newPassword:
 *               type: string
 *               example: 'test123456'
 *     responses:
 *       '200':
 *          description: Successful reset of a password.
 *       '400':
 *          description: Bad request, newPassword field is missing.
 *       '401':
 *          description: Token not exists or has expired.
 *
 *
 */

router
    .route('/reset_password/:resetToken')
    .put(passwordReset)



module.exports = router

