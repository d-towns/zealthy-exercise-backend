import { Sequelize } from "sequelize";
import * as dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URL : process.env.POSTGRESS_URL, {
    dialect: "postgres",
    logging: false,
});

