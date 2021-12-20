import request from 'supertest'
import { app } from '../../app' 

it('fails if the email dont exist' , async () => {
    await request(app)
          .post("/api/users/signin")
          .send({
              email: "test@test.com",
              password : "password"
          })
          .expect(400)
})
it('fails if you put the  incorrect password' , async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'aslkdfjalskdfj'
    })
    .expect(400);  

})
it('Responde with a coockie if singin is correct' , async () => {
    await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

  const response =  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(200); 
    expect(response.get('Set-Cookie')).toBeDefined();     
})