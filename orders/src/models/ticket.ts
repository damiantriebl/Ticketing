import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs{
    id: string;
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> { 
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: {id: string, version: number}): Promise<TicketDoc | null>;
}

const tikectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }}, 
    {
        toJSON: {   
            transform(doc, ret){
                ret.id = ret._id;
                delete ret._id;
            }
        }
    });
tikectSchema.set('versionKey', 'version');
tikectSchema.plugin(updateIfCurrentPlugin);
tikectSchema.statics.findByEvent = (event: {id: string, version: number}) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1  
    })
}

tikectSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        price: attrs.price,
        title: attrs.title
        
    });
}
tikectSchema.methods.isReserved = async function(){
    const ExistingOrder = await Order.findOne({
        ticket: this as any,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Complete
            ]
        }
    })
 
    return !!ExistingOrder;
}
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', tikectSchema);

export {Ticket}; 