import {Message} from "node-nats-streaming"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListener } from "../tickect-created-listener"
import { TicketCreatedEvent } from "@uknproject/common"
import  mongoose  from "mongoose"
import { Ticket } from "../../../models/ticket"

const setup =async () => {
    const listener = new TicketCreatedListener(natsWrapper.client)
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'el titulo de testing',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    }
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }
    return {listener, data, msg}
}
it('created and save a ticket', async () =>{
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    const tickect = await Ticket.findById(data.id)
    expect(tickect!).toBeDefined()
    expect(tickect!.title).toEqual(data.title);
    expect(tickect!.price).toEqual(data.price);

})

it('ack the Message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})