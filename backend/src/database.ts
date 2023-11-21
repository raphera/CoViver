import knex, { Knex } from 'knex';
import dotenv from 'dotenv';

dotenv.config();

const config: Knex.Config = {
  client: 'mysql2', // Ou outro cliente de banco de dados conforme necessário
  connection: process.env.DB_CONNECTION,
  // Adicione outras configurações do Knex conforme necessário
};

const db: Knex = knex(config);

export default db;