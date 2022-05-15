import  request  from "supertest";
import {app} from '../../app';
import moongose from 'mongoose'

it('Returns 404 if the tickets dont exist', async() => {
    const id = moongose.Types.ObjectId().toHexString();
    await request(app)
    .get(`/api/tickets/${id}`)
    .send()
    .expect(404);
});
it('Return only this tikets if the tickets is found', async() => {
    const title = 'concert';
    const price = 20;
    const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
        title,
        price
    })
    .expect(201);

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);
    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});