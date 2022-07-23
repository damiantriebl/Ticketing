import { ExpirationCompleteEvent } from "@uknproject/common";
import mongoose from "mongoose";
import {Message} from 'node-nats-streaming';
import { Order, OrderStatus } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";

const setup = async ()=> {
    const listener = new ExpirationCompleteListener(natsWrapper.client)
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'test title',
        price: 23
    })
    await ticket.save();
    const order = Order.build({
        status: OrderStatus.Created,
        expiresAt: new Date(),
        userId: 'asdasd',
        ticket
    });
    await order.save();
    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    }
    //@ts-ignore
    const msg:Message = {
        ack: jest.fn()
    }
    return {listener, order, ticket, data, msg}
};

it('update the order status to cancelled', async() => {
    const {listener, order,  data, msg} = await setup();
    await listener.onMessage(data, msg);
    const updatedOrdered = await Order.findById(order.id);
    expect(updatedOrdered!.status).toEqual(OrderStatus.Cancelled)

});
it('emit the order Cancelled event', async () => {
    const {listener, order, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(eventData.id).toEqual(order.id);

})
it(' ack the message', async () => {
    const {listener, order, ticket, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})