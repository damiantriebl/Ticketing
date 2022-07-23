import { Publisher, Subjects, OrderCancelledEvent } from "@uknproject/common";

export class orderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.orderCancelled = Subjects.orderCancelled;
}