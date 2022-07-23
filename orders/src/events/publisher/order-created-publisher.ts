import { Subjects, OrderCreatedEvent, Publisher } from "@uknproject/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.orderCreated = Subjects.orderCreated;
}