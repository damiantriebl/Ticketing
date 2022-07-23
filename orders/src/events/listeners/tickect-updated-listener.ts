import { Listener, Subjects, TicketUpdatedEvent } from "@uknproject/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from './queueGroupName'

export class TickedUpdatedListener extends Listener<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message){
        const tickect = await Ticket.findByEvent(data);
        if(!tickect){
            throw new Error("Tickect not found");
        }
        const { title, price} = data;
        tickect.set({title, price});
        await tickect.save()
        msg.ack(); 

    }
}