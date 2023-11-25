import { Optional } from 'sequelize'

export interface Payments {
    id: string;
    customerId: string;
    paymentDate: string;
    amount: number;
    verified: boolean;
}

export interface CreateRequest extends Optional<Payments, 'id' | 'verified'> {
}

