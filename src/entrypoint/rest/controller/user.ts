import express, { Express, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Controller, ManagedHandler } from "../server";
import { Service } from '../../../component/user/interfaces';
import { CreateRequest, DeleteRequest, GetRequest } from "../../../component/user/models";
import { APIError } from "../middleware/error";
import { log } from '../../../config'
export class UserController implements Controller {

    constructor(private service: Service) {
    }
    
    register(server: Express, middlewares?: Record<string, RequestHandler<ParamsDictionary, any, any, ParsedQs, Record<string, any>>> | undefined): void {
        const router = express.Router();
        server.use('/api/users', router);

        router.post(
            '',
            ManagedHandler(this.create.bind(this))
        )

        router.post(
            '/login',
            ManagedHandler(this.login.bind(this))
        )

        router.post(
            '/update-password',
            ManagedHandler(this.updatePassword.bind(this))
        )
    }

    async create(req: Request, res: Response) { 
        if (req.headers['role'] != 'admin') {
            res.status(403).json();
        }
        const response = await this.service.create(req.body);
        res.status(201).json({id: response});
    }

    async login(req: Request, res: Response) { 
        const response = await this.service.login(req.body);
        res.status(200).json(response);
    }

    async updatePassword(req: Request, res: Response) { 
        const response = await this.service.update(req.body);
        res.status(200).json(response);
    }
}