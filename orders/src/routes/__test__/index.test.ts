import request from 'supertest';
import { app } from '../../app';
import {Order} from '../../models/order';
import {Ticket} from '../../models/ticket';
import mongoose from 'mongoose'
it('fetches orders for a particular user',async () => {
    const buildTickets = () =>{
        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'concert',
            price: 20,
        })
        ticket.save();
        return ticket;
    }
    const user1 = global.signin();
    const user2 = global.signin();

    const ticket1 = buildTickets();
    const ticket2 = buildTickets();
    const ticket3 = buildTickets();

    await request(app)
            .post('/api/orders')
            .set('Cookie', user1)
            .send({ticketId: ticket1.id})
            .expect(201);
    const {body: order1} = await request(app)
            .post('/api/orders')
            .set('Cookie', user2)
            .send({ticketId: ticket2.id})
            .expect(201);        
     const {body: order2} = await request(app)
            .post('/api/orders')
            .set('Cookie', user2)
            .send({ticketId: ticket3.id})
            .expect(201);
    const response = await request(app)
            .get('/api/orders')
            .set('Cookie', user2)
            .expect(200)
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(order1.id);
    expect(response.body[1].id).toEqual(order2.id);
    expect(response.body[0].ticket.id).toEqual(ticket2.id);
    expect(response.body[1].ticket.id).toEqual(ticket3.id);
});