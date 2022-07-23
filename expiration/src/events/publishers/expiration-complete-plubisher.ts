import { Publisher, ExpirationCompleteEvent, Subjects  } from "@uknproject/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.expirationComplete = Subjects.expirationComplete;
    
}