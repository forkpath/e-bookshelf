import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { Book } from './entity';
import { AppDataSource } from './data-source';
import { Like } from 'typeorm';

dotenv.config();
const PORT = process.env.APIPORT || 3001;

AppDataSource.initialize().then(async () => {

    const app: Express = express();

    const allowedOrigins = ['*', 'http://localhost:3000'];
    const corsOptions: cors.CorsOptions = {
        origin: allowedOrigins
    }
    app.use(cors(corsOptions));
    app.use(bodyParser.json());

    const bookRepo = AppDataSource.getRepository(Book);

    app.get('/api/v1/books', function(req: Request, res: Response) {

        const search = req.query.search || '';
        const page = parseInt(String(req.query.page)) || 1;

        bookRepo.findAndCount({
            select: ['id', 'title', 'publisher', 'coverLink', 'date'],
            skip: (page - 1) * 24,
            take: 24,
            where: { title: Like(`%${search}%`)},
        }).then(books => {
            res.json(books);
        }).catch(err => {
            res.status(500).json(err);
        }).finally(() => {
            res.end();
        });
    });

    app.get('/api/v1/books/id', function(req: Request, res: Response) {
        bookRepo.find({
            select: ['id'],
        }).then(books => {
            res.json(books);
        }).catch(err => {
            res.status(500).json(err);
        }).finally(() => {
            res.end();
        });
    });

    app.get('/api/v1/book/:id', function(req: Request, res: Response) {
        const bookId = req.params.id;
        bookRepo.findOne({
            select: ['title', 'link'],
            where: { id: bookId }
        }).then(book => {
            // book.link 需要处理一下
            res.json(book);
        }).catch(err => {
            res.status(500).json(err);
        })
    })

    app.get('/api/v1/download/:id', function(req: Request, res: Response) {
        const bookId = req.params.id;
        bookRepo.findOne({
            select: ['title', 'link'],
            where: { id: bookId },
        }).then(book => {
            res.setHeader('Content-Type', 'application/epub+zip');
            res.download(`/data-merge/cdn/books/${book.link}`, `${book.title}.epub`, (err)=>{
                if(err){
                    if(res.headersSent) {
                        res.end();
                    } else {
                        res.send({code:"1",message:"server err"});
                    }
                }
            })
        }).catch(err => {
            res.status(500).json(err);
        })
    });

    app.listen(PORT, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
    });

}).catch(error => console.log(error))

