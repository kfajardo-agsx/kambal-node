import express, { Express, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller, ManagedHandler } from "../server";
import { Service } from '../../../component/customer/interfaces';
import { log } from '../../../config'
import { FiltersCustomers } from "../../../component/repository/models";

export class CustomerController implements Controller {

    constructor(private service: Service) {
    }
    
    register(server: Express, middlewares?: Record<string, RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>> | undefined): void {
        const router = express.Router();
        server.use('/api/customers', router);

        router.post(
            '',
            ManagedHandler(this.add.bind(this))
        )

        router.get(
            '',
            ManagedHandler(this.list.bind(this))
        )

        router.get(
            '/:id',
            ManagedHandler(this.get.bind(this))
        )
    }

    async add(req: Request, res: Response) { 
        if (req.headers['role'] != 'admin') {
            res.status(403).json();
        }
        const response = await this.service.create(req.body);
        res.status(201).json({ id: response});
    }

    async list(req: Request, res: Response) { 
        if (req.headers['role'] != 'admin') {
            res.status(403).json();
        }
        const filters: FiltersCustomers = {
        }
        if (req.query['name']!=undefined) {
            filters.name = req.query['name'] as string
        }
        if (req.query['limit']!=undefined) {
            filters.limit = Number(req.query['limit'] as string)
        }
        if (req.query['offset']!=undefined) {
            filters.offset = Number(req.query['offset'] as string)
        }
        if (req.query['order']!=undefined) {
            filters.order = req.query['order'] as string
        }
        const response = await this.service.list(filters);
        res.status(200).json(response);
    }

    async get(req: Request, res: Response) { 
        const response = await this.service.get(req.params['id']);
        res.status(200).json(response);
    }
}