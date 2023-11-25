import { Repository } from '../repository/interfaces';
import { Service } from "./interfaces";
import { CreateRequest } from "./models";
import { UserInput, UserReturn } from '../repository/models';
// import { log } from '../../config'
import { APIError } from '../../entrypoint/rest/middleware/error';
import { encrypt } from '../util/tools';

export class ItemService implements Service {
    constructor(
        private repository: Repository
    ){}

    async create(request: CreateRequest): Promise<void> {
        return await this.repository.addItem(request.name);
    }
    async list(): Promise<string[]> {
        return await this.repository.listItems()
    }

}