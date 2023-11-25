import { Repository } from '../repository/interfaces';
import { Service } from "./interfaces";
import { FiltersTransactions, Transaction, TransactionItemInput, TransactionList } from '../repository/models';
import { log } from '../../config'
import { CreateRequest } from './models';

export class TransactionService implements Service {
    constructor(
        private repository: Repository,
        
    ){}
    
    async get(customerId: string, transactionId: string): Promise<Transaction> {
        return await this.repository.getTransaction(customerId, transactionId)
    }

    async create(request: CreateRequest): Promise<string> {
        var overallTotal = 0
        const items: TransactionItemInput[] = []
        for (const item of request.items) {
            overallTotal += item.currentPrice * item.kilos
            items.push({
                item: item.item,
                currentPrice: item.currentPrice,
                kilos: item.kilos,
                total: item.currentPrice * item.kilos
            })
        }
        return await this.repository.addTransaction({
            customerId: request.customerId,
            shipmentDate: request.shipmentDate,
            shipmentCost: request.shipmentCost,
            items: items,
            total: overallTotal
        });
    }
    
    async list(filters: FiltersTransactions): Promise<TransactionList> {
        return await this.repository.listTransactions(filters)
    }
    

}