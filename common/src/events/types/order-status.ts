export enum OrderStatus {
    // the default
    Created = "created",
    // the ticket was cancelled of have a problem whit the payment
    Cancelled = "cancelled",
    // the ticket was reserved
    AwaitingPayment = "awaiting:payment",
    // the ticket was reserved and the payment was successful
    Complete = "complete",
}