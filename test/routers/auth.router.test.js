
const request = require('supertest')
const app = require('../../app')
const { setUpDB} = require('../_fixtures/fixtures');
const mongoose = require('mongoose')
const {userOne, userOneResetPasswordToken} = require('../_fixtures/user.fixture')
const {token, tokenEmptyUser} = require('../_fixtures/ids.fixture')

beforeEach(() => setUpDB());

describe('Test for /api/v1/auth/** route', () => {
    test('Should register the user',async ()=> {

        const req = {
            name: 'Jessica Doe',
            email: 'j.doe@doemail.com',
            password: 'Fishy1234'
        }

        let response = await request(app)
            .post('/api/v1/auth/register')
            .send(req).expect(200)

        expect(response.body.success).toBeTruthy();
        expect(response.body.token).not.toBe(null);
    })

    test('Should not login the user with wong credentials', async () => {

        let response = await request(app).post('/api/v1/auth/login').send({
            email: userOne.email,
            password: '123435gDF'
        }).expect(404);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe("Invalid username or password")
    })


    test('Should login the user with right credentials', async () => {

            let response = await request(app)
                .post('/api/v1/auth/login')
                .send({
                    email: userOne.email,
                    password: userOne.password
                }).expect(200);
            expect(response.body.success).toBeTruthy();
            expect(response.body.token).not.toBe(null);
    })

    test('Should logout user', async () => {

        let response = await request(app).get('/api/v1/auth/logout')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
            expect(response.body.success).toBeTruthy();
            expect(response.body.message).toBe('You have been logged out.')
    })
    test('Should fail on registration without required fields', async()=> {

        const req = {
            email: 'a.doe@doemail.com',
            password: 'Fishy1234'
        }

        let response = await request(app).post('/api/v1/auth/register').send(req).expect(400)
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe("Invalid request for registering the user")
    })


    test('Should fail on registration due to existing record in the database with provided email or user name', async()=> {

        let response = await request(app).post('/api/v1/auth/register').send(userOne).expect(409)
        expect(response.body.success).toBeFalsy()
    })



    test('Should fetch profile of the user', async()=> {

        let response = await request(app).get(`/api/v1/auth/me`)
            .set('Authorization', `Bearer ${token}`)
            .send(userOne).expect(200)
        expect(response.body.success).toBeTruthy();
    })

    test('Should not fetch profile of the user with invalid token', async()=> {

        let response = await request(app).get(`/api/v1/auth/me`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(userOne).expect(401)
        expect(response.body.success).toBeFalsy();
    })

    test('Should send url with reset password token to the specified email if user exists', async()=> {

        let body = {
            email: 'johnd@mymail.com'
        }

        let response = await request(app).post(`/api/v1/auth/forgot_password`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(200)
        expect(response.body.success).toBeTruthy()
    })

    test('Should respond with not found for non existing account with requested email in a database', async()=> {

        let body = {
            email: 'rmn@mymail.com'
        }

        let response = await request(app).post(`/api/v1/auth/forgot_password`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(404)
        expect(response.body.success).toBeFalsy();
    })

    test('Should respond with bad request with invalid forgot password request body', async()=> {

        let body = {
            emailer: 'rmn@mymail.com'
        }

        let response = await request(app).post(`/api/v1/auth/forgot_password`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(400)
        expect(response.body.success).toBeFalsy();
    })

    test('Should reset password for the user', async()=> {

        let body = {
            newPassword: 'test123456'
        }

        let response = await request(app).put(`/api/v1/auth/reset_password/${userOneResetPasswordToken}`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(200)
        expect(response.body.success).toBeTruthy();
    })

    test('Should not reset password for the user with non existing reset token', async()=> {

        let body = {
            newPassword: 'test123456'
        }

        let response = await request(app).put(`/api/v1/auth/reset_password/123`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(404)
        expect(response.body.success).toBeFalsy();
    })


    test('Should update user\'s profile', async()=> {

        let body = {
            newEmail: 'testnew@mailtest.com',
            newPassword: 'test123456',
            currentPassword: 'Fishy1234'
        }

        let response = await request(app).put(`/api/v1/auth/update_user`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(200)
        expect(response.body.success).toBeTruthy();
    })

    test('Should not update user\'s profile and return bad request error', async()=> {

        let body = {
            newEmail: 'testnew@mailtest.com',
            newPassword: 'test123456',

        }

        let response = await request(app).put(`/api/v1/auth/update_user`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(400)
        expect(response.body.success).toBeFalsy();
    })

    test('Should not update user\'s profile and return unauthenticated request error', async()=> {

        let body = {
            newEmail: 'testnew@mailtest.com',
            newPassword: 'test123456',
            currentPassword: 'Fishy1234'
        }

        let response = await request(app).put(`/api/v1/auth/update_user`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(body).expect(401)
        expect(response.body.success).toBeFalsy();
    })

    test('Should not update user\'s profile with wrong password and return unauthorized request error', async()=> {

        let body = {
            newEmail: 'testnew@mailtest.com',
            newPassword: 'test123456',
            currentPassword: 'Fishy12364'
        }

        let response = await request(app).put(`/api/v1/auth/update_user`)
            .set('Authorization', `Bearer ${token}`)
            .send(body).expect(403)
        expect(response.body.success).toBeFalsy();
    })
})




afterAll(done => {
    mongoose.connection.close();
    done();
})
