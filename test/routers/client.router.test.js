const request = require('supertest')
const app = require('../../app')
const { setUpDB} = require('../_fixtures/fixtures')
const {token, tokenEmptyUser, clientDeleteId, clientOneId} = require('../_fixtures/ids.fixture')
const {userOne} = require('../_fixtures/user.fixture')
const {platformOne} = require('../_fixtures/platforms.fixture')

beforeEach(() => setUpDB())
describe('Tests for /api/v1/clients/** route', ()=> {

    test('Should create a client for an authenticated user', async ()=> {

        let body = {
            name: 'John Tremor',
            user: userOne,
            incomePlatform: platformOne
        }


        let response = await request(app)
            .post('/api/v1/clients')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(200);

        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
        expect(response.body.data._id).not.toBe(null);
        expect(response.body.data.name).toBe('John Tremor');
    })



    test('Should not create a client for not authenticated user', async ()=> {

        let body = {
            name: 'John Tremor',
            user: userOne,
            incomePlatform: platformOne
        }


        let response = await request(app)
            .post('/api/v1/clients')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(body)
            .expect(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should not create a client for authenticated user but incorrect request', async ()=> {

        let body = {
            name: 'John Tremor',
        }

        let response = await request(app)
            .post('/api/v1/clients')
            .set('Authorization', `Bearer ${token}`)
            .send(body)
            .expect(400);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Invalid request');
    })



    test('Should delete a client for an authenticated user', async ()=> {

        let response = await request(app)
            .delete(`/api/v1/clients/${clientDeleteId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy()
    })

    test('Should not delete a client for not authenticated user', async ()=> {

        let response = await request(app)
            .delete(`/api/v1/clients/${clientDeleteId.toString()}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should update a client for an authenticated user', async ()=> {

        let updateClient = {
            name: 'Alan Doe'
        }

        let response = await request(app)
            .put(`/api/v1/clients/${clientDeleteId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updateClient)
            .expect(200);

        expect(response.body.success).toBeTruthy();
        expect(response.body.data.name).toBe('Alan Doe');
    })

    test('Should not update a client for not authenticated user', async ()=> {

        let updateClient = {
            name: 'Alan Doe'
        }


        let response = await request(app)
            .put(`/api/v1/clients/${clientDeleteId.toString()}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(updateClient)
            .expect(401);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch clients for authenticated user', async ()=> {

        let response = await request(app)
            .get(`/api/v1/clients`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

        expect(response.body.success).toBeTruthy();
        expect(response.body.data.name).not.toBe(null);
    })

    test('Should fetch client for an authenticated user', async ()=> {

        let response = await request(app)
            .get(`/api/v1/clients/${clientOneId}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch client by id and return 404 for an authenticated user but non existing client', async ()=> {

        let response = await request(app)
            .get(`/api/v1/clients/${platformOne}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(404);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Resource not found')
    })


    test('Should not fetch clients for not authenticated user', async ()=> {

        let response = await request(app)
            .get(`/api/v1/clients`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);

        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Unauthorized user')
    })
})
