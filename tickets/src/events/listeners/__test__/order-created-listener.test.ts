import  {Message} from 'node-nats-streaming';
import { OrderCreatedEvent , OrderStatus} from "@uknproject/common";
import { Ticket } from "../../../models/tickets";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose  from "mongoose";
const setup = async () => {
    // Create an instance of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
  
    // Create and save a ticket
    const ticket = Ticket.build({
      title: 'concert',
      price: 99,
      userId: 'asdf',
    });
    await ticket.save();
  
    // Create the fake data event
    const data: OrderCreatedEvent['data'] = {
      id: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      status: OrderStatus.Created,
      userId: 'alskdfj',
      expiresAt: 'alskdjf',
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    };
  
    // @ts-ignore
    const msg: Message = {
      ack: jest.fn(),
    };
  
    return { listener, ticket, data, msg };
  };
it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();
  
    await listener.onMessage(data, msg);
  
    const updatedTicket = await Ticket.findById(ticket.id);
  
    expect(updatedTicket!.orderId).toEqual(data.id);
  });
it('acks the message', async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
  
    expect(msg.ack).toHaveBeenCalled();
  });

it('published a ticket created event', async () =>{
  const { listener, ticket, data, msg } = await setup();
   await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  const ticketUpdateData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(data.id).toEqual(ticketUpdateData.orderId);
});