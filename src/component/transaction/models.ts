import { Optional } from 'sequelize'

export interface Transactions {
    id: string;
    customerId: string;
    shipmentDate: string;
    shipmentCost: number;
    total: number;

}

export interface CreateRequest extends Optional<Transactions, 'id' | 'total'> {
    items: TransactionItemCreateRequest[]
}

export interface TransactionItems {
    id: string;
    transactionId: string;
    item: string;
    currentPrice: number;
    kilos: number;
    total: number;

}

export interface TransactionItemCreateRequest extends Optional<TransactionItems, 'id' | 'total' | 'transactionId'> {
}
