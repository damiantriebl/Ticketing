import { Subjects } from "./subjects";

export interface OrderCancelledEvent {
    subject: Subjects.orderCancelled;
    data: {
        id: string;
        version: number;
        ticket: {
            id: string;
        }
    }
}