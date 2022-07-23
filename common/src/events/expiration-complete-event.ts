import  {Subjects} from './subjects';

export interface ExpirationCompleteEvent {
    subject: Subjects.expirationComplete;
    data: {
        orderId: string;
    }
}