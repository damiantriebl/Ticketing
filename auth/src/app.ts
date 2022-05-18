import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@uknproject/common";
import cookieSession from "cookie-session";
import { Socket } from "net";
// serving the flash policy file
var net = require("net");

net
  .createServer((socket: Socket) => {
    //just added
    socket.on("error", (err: Error) => {
      console.log("Caught flash policy server socket error: ");
      console.log(err.stack);
    }),
      socket.write('<?xml version="1.0"?>\n'),
      socket.write(
        '<!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd">\n'
      ),
      socket.write("<cross-domain-policy>\n");
    socket.write('<allow-access-from domain="*" to-ports="*"/>\n');
    socket.write("</cross-domain-policy>\n");
    socket.end();
  })
  .listen(843);
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
