import request from 'supertest'
import { app } from '../../app'

it('return 201 is succesful signup', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                "email": "test@test.com",
                "password" : "passwordExample"
            })
            .expect(201)
}) 
it('return 400 is  invalid mail', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                "email": "testep",
                "password" : "passwordExample"
            })
            .expect(400)
}) 
it('return 400 is  invalid password', async () => {
    return request(app)
            .post('/api/users/signup')
            .send({
                "email": "test@test.com",
                "password" : "p"
            })
            .expect(400)
}) 
it('return 400 is missing to send email and passwor', async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
        "email": "test@test.com",

    })
    .expect(400)
    return request(app)
            .post('/api/users/signup')
            .send({
               "password" : "passwordExample"
            })
            .expect(400)
}) 
it('disallow repeeting mail', async () => {
    await request(app)
            .post('/api/users/signup')
            .send({
                "email": "test@test.com",
                "password" : "passwordExample"
            })
            .expect(201)
    return request(app)
            .post('/api/users/signup')
            .send({
                "email": "test@test.com",
                "password" : "passwordExample"
            })
            .expect(400)        
}) 
it('set coockie is user is valid', async () => {
   const response =  await request(app)
            .post('/api/users/signup')
            .send({
                "email": "test@test.com",
                "password" : "passwordExample"
            })
            .expect(201)
    expect(response.get('Set-Cookie')).toBeDefined();        
}) 