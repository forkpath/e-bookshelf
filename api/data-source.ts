import "reflect-metadata"
import { DataSource } from "typeorm"
import { Book } from './entity'

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "spider_user",
    password: "spider_passwd",
    database: "spider",
    synchronize: true,
    logging: false,
    entities: [Book],
    migrations: [],
    subscribers: [],
})
