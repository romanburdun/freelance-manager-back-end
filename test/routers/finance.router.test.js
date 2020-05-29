const {token, tokenEmptyUser, projectOneId, invoiceOneId} = require('../_fixtures/ids.fixture');
const request = require('supertest');
const app = require('../../app');
const {setUpDB} = require('../_fixtures/fixtures');
const path = require('path')
const fs = require('fs')
const {createTestData} = require('../../utils/folders')
beforeEach(()=> setUpDB())

describe('Tests for /api/v1/finance/**', ()=> {
    test('Should fetch current tax year finance info for authenticated user', async()=>{

        createTestData();
        let response = await request(app)
            .get('/api/v1/finance/current-tax-year')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)

        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch current tax year finance info for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/current-tax-year')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch previous tax year finance info for authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/previous-tax-year')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)

        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null);
    })

    test('Should not fetch previous tax year finance info for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/previous-tax-year')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401);

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch current tax year expenses summary for authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/current-tax-year/expenses-summary')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);
        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch current tax year expenses summary for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/current-tax-year/expenses-summary')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should fetch previous tax year expenses summary for authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/previous-tax-year/expenses-summary')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);
        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch previous tax year expenses summary for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/previous-tax-year/expenses-summary')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch monthly income for authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/monthly-income')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200);
        expect(response.body.success).toBeTruthy()
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch monthly income for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/monthly-income')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch platforms income for authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/platforms-income')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)

        expect(response.body.success).toBeTruthy();
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch platforms income for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/platforms-income')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })

    test('Should fetch current tax year finance archive for authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/current-tax-year/archive')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)

        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch current tax year finance archive for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/current-tax-year/archive')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should fetch previous tax year finance archive for authenticated user', async()=>{

        fs.writeFile(`${process.env.PROOF_FILE_PATH}/download_test.png`, '000000000', function (err) {
            if (err) throw err;
        });

        let response = await request(app)
            .get('/api/v1/finance/previous-tax-year/archive')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)

        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch previous tax year finance archive for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/previous-tax-year/archive')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should fetch specified tax year finance archive for authenticated user', async()=>{


        createTestData();
        let response = await request(app)
            .get('/api/v1/finance/tax-year/2015/archive')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(200)
        expect(response.body.data).not.toBe(null)
    })

    test('Should not fetch specified year finance for not authenticated user', async()=>{

        let response = await request(app)
            .get('/api/v1/finance/tax-year/2015/archive')
            .set('Authorization', `Bearer ${tokenEmptyUser}`)
            .send().expect(401)

        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('Unauthorized user')
    })


    test('Should return 404 for specified tax year finance archive for authenticated user', async()=>{

        fs.writeFile(`${process.env.PROOF_FILE_PATH}/download_test.png`, '000000000', function (err) {
            if (err) throw err;
        });
        let response = await request(app)
            .get('/api/v1/finance/tax-year/2008/archive')
            .set('Authorization', `Bearer ${token}`)
            .send().expect(404)
        expect(response.body.success).toBeFalsy()
        expect(response.body.error).toBe('No data found')
    })

})
