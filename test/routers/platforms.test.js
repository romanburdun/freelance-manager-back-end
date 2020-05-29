const {platformOne} = require('../_fixtures/platforms.fixture');
const request = require('supertest');
const app = require('../../app');
const {token, tokenEmptyUser, platformOneId, platformDeleteId, clientOneId} = require('../_fixtures/ids.fixture');
const {setUpDB} = require('../_fixtures/fixtures');

beforeEach(() => setUpDB())

describe('Tests for /api/v1/platforms/**', ()=> {
    test('Should fetch platforms for authenticated user', async ()=>{

        let response = await request(app)
                .get('/api/v1/ips')
                .set('Authorization', `Bearer ${token}`)
                .send().expect(200);

        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch platforms for not authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/ips')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should create platform for authenticated user', async ()=>{

        let platform = {
            platformName: 'Testing platform creation'
        }

        let response = await request(app)
            .post('/api/v1/ips')
            .set('Authorization', `Bearer ${token}`)
            .send(platform).expect(200);
        expect(response.body.success).toBeTruthy()
        expect(response.body.data.platformName).toBe('Testing platform creation');
    })

    test('Should not create platform for authenticated user', async ()=>{

        let platform = {
            platformName: 'Testing platform creation'
        }

        let response = await request(app)
            .post('/api/v1/ips')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(platform).expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')

    })

    test('Should not create platform for authenticated user with invalid request', async ()=>{

        let platform = {
            name: 'Testing platform creation'
        }

        let response = await request(app)
            .post('/api/v1/ips')
            .set('Authorization', `Bearer ${token}`)
            .send(platform).expect(400);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })

    test('Should update platform for authenticated user', async ()=>{

        let platform = {
            platformName: 'Testing platform update'
        }

        let response = await request(app)
            .put(`/api/v1/ips/${platformOneId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(platform).expect(200);

        expect(response.body.success).toBeTruthy()
        expect(response.body.data.platformName).toBe('Testing platform update');
    })

    test('Should not update platform for not authenticated user', async ()=>{

        let platform = {
            platformName: 'Testing platform update'
        }

        let response = await request(app)
            .put(`/api/v1/ips/${platformOneId.toString()}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(platform).expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should not update platform for authenticated user with invalid request', async ()=>{

        let platform = {
            name: 'Testing platform update'
        }

        let response = await request(app)
            .put(`/api/v1/ips/${platformOneId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send(platform).expect(400);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })

    test('Should delete platform for authenticated user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/ips/${platformDeleteId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);

        expect(response.body.success).toBeTruthy()
    })

    test('Should not delete platform for not authenticated user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/ips/${platformDeleteId.toString()}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should return 404 for non existing platform', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/ips/${clientOneId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send().expect(404);

        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Resource not found');
    })
})
