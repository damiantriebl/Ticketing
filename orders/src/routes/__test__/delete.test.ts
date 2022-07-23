import request from 'supertest';
import { app } from '../../app'
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose'

it('Make the order has Cancelled', async () => {
    // create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    })
    await ticket.save();
    // make request a Order
    const user = global.signin()
    const {body: order} = await request(app)
                            .post('/api/orders')
                            .set('Cookie', user)
                            .send({ticketId: ticket.id})
                            .expect(201)
    // cancelled this order
   await request(app)
                                    .delete(`/api/orders/${order.id}`)
                                    .set('Cookie', user) 
                                    .send()
                                    .expect(204)
    // expectatnion to this is cancelled
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})
it('emit events its cancelled', async () => {
     // create a ticket
     const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "concert",
        price: 20
    })
    await ticket.save();
    // make request a Order
    const user = global.signin()
    const {body: order} = await request(app)
                            .post('/api/orders')
                            .set('Cookie', user)
                            .send({ticketId: ticket.id})
                            .expect(201)
    // cancelled this order
   await request(app)
                                    .delete(`/api/orders/${order.id}`)
                                    .set('Cookie', user) 
                                    .send()
                                    .expect(204)
    // expectatnion to this is cancelled
    expect(natsWrapper.client.publish).toHaveBeenCalled()        
})