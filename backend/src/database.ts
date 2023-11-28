import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql2',
  connection: process.env.DB_CONNECTION,
};

const db: Knex = knex(config);

export default db;