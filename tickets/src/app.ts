import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { createTicketRouter } from './routes/new';
import { errorHandler, NotFoundError } from '@uknproject/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(createTicketRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export {app}