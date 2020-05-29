const request = require('supertest');
const app = require('../../app');
const {setUpDB} = require('../_fixtures/fixtures');

const {token, tokenEmptyUser, projectDeleteId, projectOneId, projectNotExistsId} = require('../_fixtures/ids.fixture');
const {projectCreate, projectUpdate, projectCreateInvalid} = require('../_fixtures/projects.fixture');

beforeEach(() => setUpDB());


describe('Tests for /api/v1/projects/** route', ()=> {
    test('Should fetch projects successfully', async() => {

       let response = await request(app)
            .get('/api/v1/projects')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);

        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch projects if user not found', async() => {

        let response = await request(app)
            .get('/api/v1/projects')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should delete project by id for authenticated user', async() => {

        let response = await request(app)
            .delete('/api/v1/projects/' + projectDeleteId.toString())
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);
        expect(response.body.success).toBeTruthy()
    })

    test('Should not delete project by id for not authenticated user', async() => {

        let response = await request(app)
            .delete('/api/v1/projects/' + projectDeleteId.toString())
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should create project if user is authenticated', async() => {

        let response = await request(app)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${token}`)
            .send(projectCreate).expect(200);

        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
        expect(response.body.data.title).toBe('Unit test project that is created')
    })

    test('Should not create project if user is authenticated but request is invalid', async() => {

        let response = await request(app)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${token}`)
            .send(projectCreateInvalid).expect(400);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })

    test('Should not create project if user is not authenticated', async() => {

        let response = await request(app)
            .post('/api/v1/projects')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(projectCreate).expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should update project if user is authenticated', async() => {

        let response = await request(app)
            .put('/api/v1/projects/' + projectOneId.toString())
            .set('Authorization', `Bearer ${token}`)
            .send(projectUpdate).expect(200);

        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
        expect(response.body.data.title).toBe('Unit test project that is updated')
    })

    test('Should not update project if user is not authenticated', async() => {

        let response = await request(app)
            .put('/api/v1/projects/' + projectOneId.toString())
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(projectUpdate).expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch project by id if user is authenticated', async() => {

        let response = await request(app)
            .get('/api/v1/projects/' + projectOneId.toString())
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);

        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch project if user is authenticated but project not exists', async() => {

        let response = await request(app)
            .get('/api/v1/projects/' + projectNotExistsId.toString())
            .set('Authorization', `Bearer ${token}`)
            .send().expect(404);

        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Resource not found');
    })

})




