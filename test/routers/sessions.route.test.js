const request = require('supertest');
const app = require('../../app');
const {setUpDB} = require('../_fixtures/fixtures');

const {token, tokenEmptyUser, sessionOneId, sessionTwoId, sessionThreeId, sessionFourId, userOneId} = require('../_fixtures/ids.fixture');

beforeEach(()=>setUpDB())

 describe('Tests for /api/v1/sessions/** route', ()=> {

    test('Should fetch productivity trends for authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/sessions/trends')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch productivity trends for not authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/sessions/trends')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should delete session for authorized user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/sessions/${sessionFourId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not delete session for authenticated user but not existing session', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/sessions/${userOneId.toString()}`)
            .set('Authorization', `Bearer ${token}`)
            .send().expect(404);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Resource not found');
    })

    test('Should not delete session for not authenticated user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/sessions/${sessionFourId.toString()}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should record session for authenticated user', async ()=>{

        let session = {
            sessionDate: new Date(),
            sessionStart: new Date(),
            sessionEnd: new Date(),
            user: userOneId
        }
        let response = await request(app)
            .post(`/api/v1/sessions`)
            .set('Authorization', `Bearer ${token}`)
            .send(session).expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not record session for not authenticated user', async ()=>{

        let session = {
            sessionDate: new Date(),
            sessionStart: new Date(),
            sessionEnd: new Date(),
            user: userOneId
        }
        let response = await request(app)
            .post(`/api/v1/sessions`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(session).expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })
    test('Should not record session for authorized user, but incorrect request', async ()=>{

        let session = {
            sessionDate: new Date(),
            user: userOneId
        }
        let response = await request(app)
            .post(`/api/v1/sessions`)
            .set('Authorization', `Bearer ${token}`)
            .send(session).expect(400);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })
})
