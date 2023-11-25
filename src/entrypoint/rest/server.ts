import express, { Express } from 'express';
import * as http from 'http';
import { RequestHandler, Request, Response, NextFunction } from 'express'
import { ParamsDictionary, Query } from "express-serve-static-core";
import { validationResult } from 'express-validator';
import cors from 'cors';
import { ErrorMiddleware } from './middleware/error';
import { log } from '../../config'

export const JWT_MIDDLEWARE = 'jwt'

export interface Controller {
    register(server: Express, middlewares?: Record<string, RequestHandler>): void
}

export const ManagedHandler = <P extends ParamsDictionary, R extends any, Rs extends any, Q extends Query>(h: RequestHandler<P, Rs, R, Q>): RequestHandler<P, Rs, R, Q> => {
    return (async (req: Request<P, Rs, R, Q>, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                errors.throw()
            }
            await h(req, res, next)
        } catch(err) {
            next(err)
        }
    })
}

export class Server {

    private static readonly DEFAULT_HOSTNAME = '0.0.0.0';
    private static readonly DEFAULT_PORT = 3000;

    private httpServer: http.Server | undefined;

    constructor(
        private instance: Express,
        private controllers: Controller[],
        private hostname: string = Server.DEFAULT_HOSTNAME,
        private port: number = Server.DEFAULT_PORT,
        private middlewares?: Record<string, RequestHandler>,
    ) {
        try {
            instance.use(cors());
            instance.use(express.json({ type: 'application/*' }));
            if (this.controllers?.length > 0) {
                this.controllers.forEach(c => {
                    c.register(this.instance, this.middlewares)
                    log.info(`controller registered: ${c.constructor.name}`)
                })
            }
            instance.use(ErrorMiddleware);    
        } catch(err) {
            log.error(`server error: could not start the server: ${err}`)
            process.exit(1)
        }
    }

    start() {
        this.httpServer = this.instance.listen(this.port, this.hostname)
    }

    stop() {
        this.httpServer?.close()
    }

}
