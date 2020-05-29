const request = require('supertest')
const app = require('../../app')
const {setUpDB} = require('../_fixtures/fixtures')
const {token, tokenEmptyUser, projectOneId, deleteTaskId} = require('../_fixtures/ids.fixture');
const {task, bulkTasks} = require('../_fixtures/tasks.fixture')
 beforeEach(()=> setUpDB())

describe('Tests for /api/v1/tasks/** route',()=> {
    test('Should create a task for a project with authenticated user', async ()=> {

        let response = await request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(task).expect(200)

        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
        expect(response.body.data.title).toBe('Test single task jest');
    })

    test('Should not create a task for a project with not authenticated user', async ()=> {

        let response = await  request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(task).expect(401)
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should not create a task if invalid request sent', async ()=> {

        let invalidTask = {
            name: 'Wrong property'
        }

        let response = await  request(app)
            .post('/api/v1/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(invalidTask).expect(400);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })

    test('Should bulk upload tasks for a project with authenticated user', async ()=> {

        let response = await request(app)
            .post(`/api/v1/tasks/${projectOneId}/bulk`)
            .set('Authorization', `Bearer ${token}`)
            .send(bulkTasks).expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not bulk upload tasks for a project with not authenticated user', async ()=> {

        let response = await request(app)
            .post(`/api/v1/tasks/${projectOneId}/bulk`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(bulkTasks).expect(401)
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should delete task for a project with authenticated user', async ()=> {

        let response = await request(app)
            .delete(`/api/v1/tasks/${deleteTaskId}`)
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)
        expect(response.body.success).toBeTruthy();
    })

    test('Should not delete task for a project with not authenticated user', async ()=> {

        let response = await request(app)
            .delete(`/api/v1/tasks/${deleteTaskId}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })






})
