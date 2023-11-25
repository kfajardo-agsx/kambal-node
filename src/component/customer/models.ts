import { Optional } from 'sequelize'

export interface Customers {
    id: string;
    name: string;
    balance?: number;
}

export interface CreateRequest extends Optional<Customers, 'id'> {
}

