import {Publisher, Subjects, TicketCreatedEvent} from '@uknproject/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
}