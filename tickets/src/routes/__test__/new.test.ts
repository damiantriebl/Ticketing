import request from "supertest";
import { app } from "../../app";

it("check recibe /api/new for post request", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be acces if sign in", () => {

});
it("return error if the invalid title is provided", () => {
  return request(app).post("/api/new").send({
    name: "test",
    email: "",
  });
});
it("return error if the invalid price is provided", () => {
  return request(app).post("/api/new").send({
    name: "test",
    email: "",
  });
});
it("create ticket with valid parameters", () => {
  return request(app).post("/api/new").send({
    name: "test",
    email: "",
  });
});
