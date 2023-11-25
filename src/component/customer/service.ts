import { Repository } from '../repository/interfaces';
import { Service } from "./interfaces";
import { CreateRequest } from "./models";
import { Customer, CustomerList, CustomerReturn, FiltersCustomers, Payment, UserInput, UserReturn } from '../repository/models';
import { log } from '../../config'
import { APIError } from '../../entrypoint/rest/middleware/error';
import { encrypt } from '../util/tools';
import { UserService } from '../user/service';
import { TransactionService } from '../transaction/service';
import { PaymentService } from '../payment/service';

export class CustomerService implements Service {
    constructor(
        private repository: Repository,
        private userService: UserService,
         // private transactionItemService: TransactionItemService,
        // private paymentService: PaymentService,
    ){}
    
    async get(customerId: string): Promise<CustomerReturn> {
        return await this.repository.getCustomer(customerId)
    }
    
    async create(request: CreateRequest): Promise<string> {
        const id = await this.repository.createCustomer({
            name: request.name,
            balance: request.balance || 0
        })
        // create user account for this customer
        await this.userService.create({
            username: request.name,
            password: process.env.DEFAULT_PASSWORD || 'kambal',
            customerId: id,
        })
        return id
    }

    async list(filters: FiltersCustomers): Promise<CustomerList> {
        return await this.repository.listCustomers(filters)
    }

    

}