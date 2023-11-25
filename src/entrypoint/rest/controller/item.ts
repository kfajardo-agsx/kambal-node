import express, { Express, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller, ManagedHandler } from "../server";
import { Service } from '../../../component/item/interfaces';
export class ItemController implements Controller {

    constructor(private service: Service) {
    }
    
    register(server: Express, middlewares?: Record<string, RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>> | undefined): void {
        const router = express.Router();
        server.use('/api/items', router);

        router.post(
            '',
            ManagedHandler(this.add.bind(this))
        )

        router.get(
            '',
            ManagedHandler(this.list.bind(this))
        )
    }

    async add(req: Request, res: Response) { 
        if (req.headers['role'] != 'admin') {
            res.status(403).json();
        }
        const response = await this.service.create(req.body);
        res.status(201).json();
    }

    async list(req: Request, res: Response) { 
        if (req.headers['role'] != 'admin') {
            res.status(403).json();
        }
        const response = await this.service.list();
        res.status(200).json(response);
    }
}