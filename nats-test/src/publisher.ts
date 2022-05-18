import nats from 'node-nats-streaming';
import {TicketCreatedPublisher} from './events/ticket-created-publisher';

const stan = nats.connect('ticketing', 'abc', {
    url: "http://localhost:4222"
});

stan.on('connect', async  () => {
    const publisher = new TicketCreatedPublisher(stan);
    try {
       await publisher.publish({
            id: "1as1",
            title: "concert",
            price: 20
        })
    } catch (error) {
         console.error();
        
    }
    
    console.log('Publisher connected to Nats!') 
})