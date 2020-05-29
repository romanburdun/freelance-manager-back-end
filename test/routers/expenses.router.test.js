const {token, tokenEmptyUser, userOneId, expenseDeleteId, expenseOneId} = require('../_fixtures/ids.fixture');
const {setUpDB} = require('../_fixtures/fixtures');
const request = require('supertest');
const app = require('../../app');
const {createTestData} = require('../../utils/folders')
beforeEach(()=> setUpDB())
describe('Tests for /api/v1/expenses/**', ()=> {
    test('Should create an expense for an authenticated user', async ()=>{

        let newExpense = {
            expenseTitle: 'Jest expense create test',
            expenseAmount: 22.65,
            expenseDate: new Date(),
            expenseProof: null,
            user: userOneId
        }

        let response = await request(app)
            .post('/api/v1/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send(newExpense)
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data.expenseTitle).toBe('Jest expense create test')
    })

    test('Should not create an expense for not authenticated user', async ()=>{

        let newExpense = {
            expenseTitle: 'Jest expense create test',
            expenseAmount: 22.65,
            expenseDate: new Date(),
            expenseProof: null,
            user: userOneId
        }

        let response = await request(app)
            .post('/api/v1/expenses')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send(newExpense)
            .expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should not create an expense with incorrect request', async ()=>{

        let newExpense = {

            expenseDate: new Date(),
            expenseProof: null,
            user: userOneId
        }

        let response = await request(app)
            .post('/api/v1/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send(newExpense).expect(400);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })


    test('Should fetch current tax year expenses for authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/expenses')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch current tax year expenses for not authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/expenses')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should fetch previous tax year expenses for authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/expenses/previous-tax-year')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch previous tax year expenses for not authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/expenses/previous-tax-year')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should download expense proof for authenticated user', async ()=>{

        createTestData();

        let response = await request(app)
            .get(`/api/v1/expenses/${expenseOneId}/proof`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body).not.toBe(null);
    })




    test('Should return 404 for non existing expense for not authenticated user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/expenses/${userOneId}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(404);
        expect(response.body.success).toBeFalsy();
        expect(response.body.error).toBe('Resource not found')
    })





    test('Should upload expense proof for authenticated user', async ()=>{

        let response = await request(app)
            .put(`/api/v1/expenses/${expenseOneId}/proof`)
            .set('Authorization', `Bearer ${token}`)
            .attach('proof', './test/routers/files/test-expense.pdf')
            .expect(200);
        expect(response.body.data).not.toBe(null);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data._id).toBe(expenseOneId.toString());
    })


    test('Should get list of expenses already in the database for authenticated user', async ()=>{

        let response = await request(app)
            .get(`/api/v1/expenses/options-list`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should delete expense by id for authenticated user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/expenses/${expenseDeleteId}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
    })

    test('Should not delete expense by id for not authenticated user', async ()=>{

        let response = await request(app)
            .delete(`/api/v1/expenses/${expenseDeleteId}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })
})



