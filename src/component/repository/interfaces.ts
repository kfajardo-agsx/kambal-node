import { CustomerInput, CustomerList, CustomerReturn, FiltersCustomers, FiltersPayments, FiltersTransactions, PaymentInput, PaymentList, Transaction, TransactionInput, TransactionList, User, UserInput } from './models';

// export interface Repository {
//     partyExists(party: PartyInput): Promise<Party | null>
//     getOrCreateParticipant(fspId: string): Promise<Participant>
//     createParty(party: PartyInput, fsp: Participant): Promise<string>
//     updateParty(party: Party, fsp: Participant): Promise<void>
//     getParty(partyIdType: string, partyIdentifier: string, partySubIdOrType: string, currency: string): Promise<PartyReturn[]>
//     deleteParty(party: PartyInput): Promise<void>
// }

export interface Repository {
    createUser(user: UserInput): Promise<string>
    getUser(username: string, password: string): Promise<User | null>
    updatePassword(username: string, newPassword: string): Promise<void>

    addItem(name: string): Promise<void>
    listItems(): Promise<string[]>

    createCustomer(customer: CustomerInput): Promise<string>
    listCustomers(filters: FiltersCustomers): Promise<CustomerList>
    getCustomer(customerId: string): Promise<CustomerReturn>
    addToCustomerBalance(customerId: string, amount: number): Promise<void>
    subtractFromCustomerBalance(customerId: string, amount: number): Promise<void>

    addTransaction(request: TransactionInput): Promise<string>
    listTransactions(filters: FiltersTransactions): Promise<TransactionList>
    getTransaction(customerId: string, transactionId: string): Promise<Transaction>

    addPayment(request: PaymentInput): Promise <string>
    listPayments(filter: FiltersPayments): Promise<PaymentList>
    verifyPayment(paymentId: string): Promise<void>
    
}