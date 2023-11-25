import express, { Express, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller, ManagedHandler } from "../server";
import { Service } from '../../../component/transaction/interfaces';
import { log } from '../../../config'
import { FiltersTransactions } from "../../../component/repository/models";
export class TransactionController implements Controller {

    constructor(
        private service: Service) {
    }
    
    register(server: Express, middlewares?: Record<string, RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>> | undefined): void {
        const router = express.Router();
        server.use('/api/customers', router);

        // create a customer transaction
        router.post(
            '/:id/transactions',
            ManagedHandler(this.create.bind(this))
        )

        // get all customer transactions
        router.get(
            '/:id/transactions',
            ManagedHandler(this.list.bind(this))
        )

        // get all customer transactions
        router.get(
            '/:id/transactions/:transactionId',
            ManagedHandler(this.get.bind(this))
        )
    }

    async create(req: Request, res: Response) { 
        req.body['customerId'] = req.params['id']
        const response = await this.service.create(req.body);
        
        res.status(201).json({id: response});
    }

    async list(req: Request, res: Response) { 
        const filters: FiltersTransactions = {
            customerId: req.params['id']
        }
        if (req.query['shipmentDate']!=undefined) {
            filters.shipmentDate = req.query['shipmentDate'] as string
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
        const customerId = req.params['id']
        const transactionId = req.params['transactionId']
        const response = await this.service.get(customerId, transactionId);
        
        res.status(201).json(response);
    }


    // async verify(req: Request, res: Response) { 
    //     if (req.headers['role'] != 'admin') {
    //         res.status(403).json();
    //     }
    //     const response = await this.service.list();
    //     res.status(200).json(response);
    // }

    // async listItems(req: Request, res: Response) { 
    //     if (req.headers['role'] != 'admin') {
    //         res.status(403).json();
    //     }
    //     const response = await this.service.list();
    //     res.status(200).json(response);
    // }
}