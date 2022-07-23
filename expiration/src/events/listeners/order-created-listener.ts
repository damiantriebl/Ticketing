import {Listener, OrderCreatedEvent, Subjects} from '@uknproject/common'
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queue/expiration-queue';
import { queueGroupName } from './queueGroupName';
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.orderCreated= Subjects.orderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg:Message){
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('the delay is', delay)
        await expirationQueue.add({
            orderId: data.id
        },{delay});
        msg.ack();
    }
}