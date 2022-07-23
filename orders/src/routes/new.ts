import express, { Request, Response } from "express";
import  { requireAuth, validateRequest, OrderStatus, BadRequestError,NotFoundError } from "@uknproject/common";
import mongoose from "mongoose";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";

const router = express.Router();
const EXPIRED_WINDOWS_SECONDS = 60 * 1;
router.post('/api/orders/', requireAuth, [
    body('ticketId')
    .not()
    .isEmpty()
    .custom((input:string)=> mongoose.Types.ObjectId.isValid(input))
    .withMessage('TicketId must be provided or valid'),
], validateRequest ,async (req:Request, res: Response) => {
    // check the Tickets exist 
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
        throw new NotFoundError();
    }
    // check if the ticket is available
    const isReserved = await ticket.isReserved();
    if(isReserved){
        throw new BadRequestError("Ticket is already reserved");
    }
    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + EXPIRED_WINDOWS_SECONDS);
    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt,
        ticket 
    });
    await order.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        expiresAt: order.expiresAt.toISOString(),
        userId: order.userId,
        version: order.version,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    })


    res.status(201).send(order);

})

export {router as newOrderRouter};