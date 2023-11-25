import { CreateRequest } from "./models";
import { APIError } from "../../entrypoint/rest/middleware/error";
import { Customer, CustomerList, CustomerReturn, FiltersCustomers, Payment } from "../repository/models";

export interface Service {
    create(request: CreateRequest): Promise<string>
    list(filters: FiltersCustomers): Promise<CustomerList> 
    get(customerId: string): Promise<CustomerReturn>
    // get payments
    // getCustomerPayments(customerId: string): Promise<Payment[]>
    // add payment
    // get balance
}

