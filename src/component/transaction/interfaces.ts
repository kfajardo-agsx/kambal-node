import { FiltersTransactions, Transaction, TransactionList } from "../repository/models";
import { CreateRequest } from "./models";
// import { APIError } from "../../entrypoint/rest/middleware/error";
// import { Customer } from "../repository/models";

export interface Service {
    create(request: CreateRequest): Promise<string>
    list(filters: FiltersTransactions): Promise<TransactionList>
    get(customerId: string, transactionId: string): Promise<Transaction>
    // get payments
    // add payment
    // get balance
}

