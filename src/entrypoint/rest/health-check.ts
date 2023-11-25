import express, { Express, Request, Response } from "express";
import { Controller } from "./server";

interface HealthCheckResponse {
    ok: boolean
}

export class HealthCheckController implements Controller {
    register(server: Express): void {
        const router = express.Router()
        server.use('/api', router);

        router.get('/health/readiness', HealthCheckController.readiness);
        router.get('/health/liveness', HealthCheckController.liveness);
        router.get('/spec', this.serveFile.bind(this) )
    }

    private static readiness(req: Request, res: Response<HealthCheckResponse>) {
        HealthCheckController.sendStatusOK(res);
    }

    private static liveness(req: Request, res: Response<HealthCheckResponse>) {
        HealthCheckController.sendStatusOK(res);
    }

    private static sendStatusOK(res: Response<HealthCheckResponse>) {
        res.send({ ok: true });
    }

    serveFile(req: Request, res: Response<HealthCheckResponse>) {
        res.sendFile('docs/openapi.yaml', { root: '.'});
    }
}

