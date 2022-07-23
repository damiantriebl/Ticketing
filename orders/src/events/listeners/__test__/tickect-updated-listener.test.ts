import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { TickedUpdatedListener } from "../tickect-updated-listener"
import {Message} from 'node-nats-streaming'
import { TicketUpdatedEvent } from "@uknproject/common";
const setup = async () => {
    const listener = new TickedUpdatedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20,
    })
    await ticket.save();
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new concert',
        price: 300,
        userId: 'asdasdsaf'
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
     
    return {msg, data, ticket, listener}
}

it('find, update, and save tickect', async () =>{
    const {msg, ticket, listener, data} = await setup();
    await listener.onMessage(data, msg);
    const updateTicket = await Ticket.findById(ticket.id);
    expect(updateTicket!.title).toEqual(data.title);
    expect(updateTicket!.price).toEqual(data.price);
    expect(updateTicket!.version).toEqual(data.version);

})

it('check the ack', async () => {
    const {msg, listener, data } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();

})
it('check dont pass for ack if the version is diferent', async () =>{
    const {msg, listener, data} = await setup();
    data.version = 10;
    try{
        await listener.onMessage(data,msg);
    }catch { }
    expect(msg.ack).not.toHaveBeenCalled();
})