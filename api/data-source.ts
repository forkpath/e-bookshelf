import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Book } from './entity'
import dotenv from 'dotenv'

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    username: process.env.DBUSER,
    password: process.env.DBPASSWD,
    database: process.env.DBNAME,
    synchronize: true,
    logging: false,
    entities: [Book],
    migrations: [],
    subscribers: [],
})
