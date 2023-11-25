import { CreateRequest, LoginRequest, UpdateRequest, DeleteRequest } from "./models";
import { UserReturn } from "../repository/models";
import { APIError } from "../../entrypoint/rest/middleware/error";

export interface Service {
    create(request: CreateRequest): Promise<string>
    update(request: UpdateRequest): Promise<void | APIError>
    login(request: LoginRequest): Promise<UserReturn | APIError> 
}