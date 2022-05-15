import request from 'supertest';
import { app } from '../../app';


const createTikect = () => {
    return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title: 'asdfasdasd',
        price: 20,
    });
}

it('Retrieve all tickets', async() => {
    await createTikect();
    await createTikect();
    await createTikect();
    const response = await request(app)
    .get('/api/tickets')
    .send()
    .expect(200)

    expect(response.body.length).toEqual(3);

})