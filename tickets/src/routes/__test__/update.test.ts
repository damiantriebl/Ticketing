import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/tickets";
import moongose from "mongoose";
import { natsWrapper } from '../../nats-wrapper';


it("Return 404 if the id dont exist", async () => {
  const id = new moongose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdfasd",
      price: 20,
    })
    .expect(404);
});

it("Return 401 if the user is not authenticated", async () => {
  const id = new moongose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "asdfasd",
      price: 20,
    })
    .expect(401);
});

it("Return 401 if the user is not the own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "asdfasd",
      price: 201,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "asdasdasdas cascascasc",
      price: 2220,
    })
    .expect(401);
});

it("Return 400 if the user send invalid title or price", async () => {
  const coockie = global.signin();
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", coockie)
    .send({
      title: "asdfasd",
      price: 201,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", coockie)
    .send({
      title: "",
      price: 2220,
    })
    .expect(400);
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", coockie)
    .send({
      title: "asdasdasdsa",
      price: -10,
    })
    .expect(400);
});

it("Update the tickets provided valid inputs", async () => {
  const coockie = global.signin();
  const title = "el Precio de la vida";
  const price = 400;
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", coockie)
    .send({
      title: "asdfasd",
      price: 201,
    });
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", coockie)
    .send({
      title,
      price,
    })
    .expect(200);
  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
it('request reject if the ticket has reserved', async () =>{
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
    });
  const ticket = await Ticket.findById(response.body.id);
  ticket!.set({orderId: new moongose.Types.ObjectId().toHexString()});
  await ticket!.save();

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(400);
})