import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@uknproject/common";
import { Ticket } from "../models/tickets";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-update-publisher";
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketRes = await Ticket.findById(req.params.id);
    if (!ticketRes) {
      throw new NotFoundError();
    }
    if (ticketRes.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    ticketRes.set({
        title: req.body.title,
        price: req.body.price,
    })
    await ticketRes.save();
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticketRes.id,
      title: ticketRes.title, 
      price: ticketRes.price,
      userId: ticketRes.userId
    });
    res.send(ticketRes);
  }
);

export { router as updateTicketsRouter };
