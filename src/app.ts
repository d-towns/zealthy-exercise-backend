import express from 'express';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import { CommonRoutesConfig } from './common/common.routes';
import cors from 'cors';
import { sequelize } from './db';
import ReplyThread from './models/replyThread.model';
import { TicketsRoutes } from './routes/tickets.routes';
dotenv.config();

const app = express();

const port = process.env.PORT;
const routes: Array<CommonRoutesConfig> = [];

app.use(cors(
  {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }
));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

sequelize.authenticate().then(() => {
  console.log('Database connection has been established successfully.');
  sequelize.modelManager.addModel(require('./models/ticket.model').default);
  sequelize.modelManager.addModel(require('./models/replyThread.model').default);
  sequelize.sync({alter: true});
});


// Routes
routes.push(new TicketsRoutes(app));

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});


process.on('SIGINT', async () => {
  await sequelize.close();
  console.log('Database connection closed.');
  process.exit();
});
