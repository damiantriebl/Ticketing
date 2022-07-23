import { Listener, PaymentCreatedEvent, Subjects, OrderStatus } from "@uknproject/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class PaymentCompleteListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.paymentCreated = Subjects.paymentCreated;
    queueGroupName = 'payment-service';
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message){
        const order = await Order.findById(data.orderId);
        if(!order){
            throw new Error('order not found');
        }
        if(order.status === OrderStatus.Complete){
            return msg.ack();
        }
        order.set({status: OrderStatus.Cancelled});
        await order.save();
        msg.ack();
    }
  
}