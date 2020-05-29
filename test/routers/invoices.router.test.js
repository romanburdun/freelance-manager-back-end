const {token, tokenEmptyUser, projectOneId, invoiceOneId} = require('../_fixtures/ids.fixture');
const request = require('supertest');
const app = require('../../app');
const {setUpDB} = require('../_fixtures/fixtures');
const fs = require('fs')
const {createTestData} = require('../../utils/folders')
beforeEach(()=> setUpDB())




describe('Tests for /api/v1/invoices/**', ()=> {
    test('Should not create invoice if user is not authenticated', async()=>{

        let response = await request(app)
            .post('/api/v1/invoices')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should not create invoice if user provides invoice data in invalid format', async()=>{

        let response = await request(app)
            .post('/api/v1/invoices')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(400)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Invalid request')
    })

    test('Should create invoice if user is authenticated', async()=>{

        let invoiceInfo = {
            project: projectOneId,
            projectTitle: "projectTitle",
            paymentDate: '2020-04-20',
            paymentAmount: 300,
        }

        let response = await request(app)
            .post('/api/v1/invoices')
            .set('Authorization', `Bearer ${token}`)
            .send(invoiceInfo)
            .expect(200)

        expect(response.body.success).toBeTruthy()
    })


    test('Should fetch current tax year invoices for authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/invoices')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch current tax year invoices for not authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/invoices')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should fetch previous tax year invoices for authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/invoices/previous-tax-year')
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);
        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch previous tax year invoices for not authenticated user', async ()=>{

        let response = await request(app)
            .get('/api/v1/invoices/previous-tax-year')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should download invoice if user is authenticated', async()=>{


        createTestData();

        let response = await request(app)
            .get(`/api/v1/invoices/${invoiceOneId}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

        expect(response.body).not.toBe(null);
    })

    test('Should not download invoice if user is not authenticated', async()=>{

        let response = await request(app)
            .get(`/api/v1/invoices/${invoiceOneId}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);

        expect(response.body).not.toBe(null);
    })

    test('Should delete invoice if user is authenticated', async()=>{

        let response = await request(app)
            .delete(`/api/v1/invoices/${invoiceOneId}`)
            .set('Authorization', `Bearer ${token}`)
            .send()
            .expect(200);

        expect(response.body).not.toBe(null);
    })


    test('Should not delete invoice if user is not authenticated', async()=>{

        let response = await request(app)
            .delete(`/api/v1/invoices/${invoiceOneId}`)
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send()
            .expect(401);

        expect(response.body).not.toBe(null);
    })
})
