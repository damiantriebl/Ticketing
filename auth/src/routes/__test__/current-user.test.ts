import request from 'supertest'
import { app } from '../../app'

it('response with detail about current user', async () =>{
   const cookie =  await global.signin() 
    const response = await request(app)
                    .get('/api/users/currentuser')
                    .set('Cookie', cookie)
                    .send()
                    .expect(200)
    expect(response.body.currentUser.email).toEqual('test@test.com')
})
it('retun null cookie if you dont have session' ,async () => {
    const response = await request(app)
            .get('/api/users/currentuser')
            .send()
            .expect(200)
    expect(response.body.currentUser).toBeNull()
})