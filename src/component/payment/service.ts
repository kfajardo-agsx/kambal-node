import { Repository } from '../repository/interfaces';
import { Service } from "./interfaces";
import { Customer, FiltersPayments, Payment, PaymentList, UserInput, UserReturn } from '../repository/models';
// import { log } from '../../config'
import { APIError } from '../../entrypoint/rest/middleware/error';
import { encrypt } from '../util/tools';
import { UserService } from '../user/service';
import { CreateRequest } from './models';

export class PaymentService implements Service {
    constructor(
        private repository: Repository,
    ){}
    async create(request: CreateRequest): Promise<string> {
        const id = await this.repository.addPayment({
            customerId: request.customerId,
            paymentDate: request.paymentDate,
            amount: request.amount || 0
        })
        return id
    }
    async list(filters: FiltersPayments): Promise<PaymentList> {
        return await this.repository.listPayments(filters)
    }
    async verify(paymentId: string): Promise<void> {
       return await this.repository.verifyPayment(paymentId)
    }
    
    

}