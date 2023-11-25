import { CreateRequest } from "./models";
import { APIError } from "../../entrypoint/rest/middleware/error";

export interface Service {
    create(request: CreateRequest): Promise<void>
    list(): Promise<string[]>
}

