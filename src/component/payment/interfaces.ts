// import { CreateRequest } from "./models";
// import { APIError } from "../../entrypoint/rest/middleware/error";
// import { Customer } from "../repository/models";

import { FiltersPayments, PaymentList } from "../repository/models";
import { CreateRequest } from "./models";

export interface Service {
    create(request: CreateRequest): Promise<string>
    list(filters: FiltersPayments): Promise<PaymentList>
    verify(paymentId: string): Promise<void>
}

