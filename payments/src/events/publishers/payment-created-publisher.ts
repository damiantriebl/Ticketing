import { Subjects, Publisher, PaymentCreatedEvent } from '@uknproject/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.paymentCreated = Subjects.paymentCreated;
}
