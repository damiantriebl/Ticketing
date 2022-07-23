import { ExpirationCompleteEvent, Listener, OrderStatus, Subjects } from "@uknproject/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from './queueGroupName'
import { orderCancelledPublisher } from "../publisher/order-cancelled-publisher";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    subject: Subjects.expirationComplete = Subjects.expirationComplete;
    queueGroupName: string = queueGroupName;
    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if(!order){
            throw new Error('order not found')
        }       
        order.set({status: OrderStatus.Cancelled});
        await order.save();
        await new orderCancelledPublisher(this.client).publish({
            id:order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })
        msg.ack();
   }
}