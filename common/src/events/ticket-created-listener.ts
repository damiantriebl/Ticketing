import { Listener } from "./base-listener";
import nats from 'node-nats-streaming';
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = "payment-service";
  onMessage(data: TicketCreatedEvent["data"], message: nats.Message): void {
    console.log("Event Data! numero 2 ", data);
    message.ack();
  }
}