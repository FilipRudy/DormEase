import { DataSource, DataSourceOptions } from 'typeorm';

import { config } from 'dotenv';

config();

export const dbdatasource: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  entities: ['dist/entity/*.js'],
  migrations: ['dist/migrations/*.js'],
};

const datasource = new DataSource(dbdatasource);
export default datasource;
