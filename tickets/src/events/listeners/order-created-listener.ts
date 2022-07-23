import { Listener, OrderCreatedEvent, OrderStatus, Subjects, TicketCreatedListener } from "@uknproject/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/tickets";
import { natsWrapper } from "../../nats-wrapper";
import { TicketCreatedPublisher } from "../publisher/ticket-create-publisher";
import { TicketUpdatedPublisher } from "../publisher/ticket-update-publisher";
import { queueGroupName } from "./queueGroupName";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.orderCreated = Subjects.orderCreated
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const ticket = await Ticket.findById(data.ticket.id);
        if(!ticket){
            throw new Error("Ticket not found");
        }
        ticket.set({orderId: data.id});

        await ticket.save();
        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            userId: ticket.userId,
            orderId: ticket.orderId,
            version: ticket.version
        });
        msg.ack();
    }
}