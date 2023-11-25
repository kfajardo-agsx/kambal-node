import { Association, BelongsToSetAssociationMixin, BelongsToGetAssociationMixin, HasManyAddAssociationMixin, HasManyGetAssociationsMixin, Model } from 'sequelize'
import { UUID } from 'crypto';
import { Optional } from 'sequelize'
import { Users } from '../user/models';
import { Items } from '../item/models';
import { Customers } from '../customer/models';
import { Payments } from '../payment/models';
import { Transactions } from '../transaction/models';
import { TransactionItems } from '../transaction/models';


export class User extends Model<Users> implements Users {
  public id!: UUID
  public username!: string;
  public encryptedPassword!: string;
  public customerId!: string;
  public userRole!: string;
  
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export interface UserReturn {
  id: string;
  username: string;
  userRole: string;
  customerId: string;
}

export interface UserInput {
    username: string;
    encryptedPassword: string;
    userRole?: string;
    customerId?: string;
}

export class Item extends Model<Items> implements Items {
  public name!: string
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}


export class Customer extends Model<Customers> implements Customers {
  public id!: string
  public name!: string
  public balance!: number
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  declare getTransactions: HasManyGetAssociationsMixin<Transaction>;
  declare addTransaction: HasManyAddAssociationMixin<Transaction, number>;

  public readonly transactions?: Transaction[]

  public static associations: {
    transactions: Association<Customer, Transaction>;
  };
}

export interface CustomerInput {
  name: string;
  balance?: number;
}

export interface CustomerReturn {
  id: string;
  name: string;
  balance: number;
}

export interface FiltersCustomers {
  name?: string;
  limit?: number;
  offset?: number;
  order?: string;
}
export interface CustomerList {
  total: number;
  filters: FiltersCustomers;
  data: Customer[];
}

export class Payment extends Model<Payments> implements Payments {
  public id!: string
  public customerId!: string;
  public paymentDate!: string;
  public amount!: number;
  public verified!: boolean;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

export interface PaymentInput {
  customerId: string;
  paymentDate: string;
  amount: number
}

export interface FiltersPayments {
  customerId: string;
  paymentDate?: string;
  limit?: number;
  offset?: number;
  order?: string;
}
export interface PaymentList {
  total: number;
  filters: FiltersPayments;
  data: Payment[];
}

export class Transaction extends Model<Transactions> implements Transactions {
  public id!: string
  public customerId!: string;
  public shipmentDate!: string;
  public shipmentCost!: number;
  public total!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  declare getTransactionItems: HasManyGetAssociationsMixin<TransactionItem>;
  declare addTransactionItem: HasManyAddAssociationMixin<TransactionItem, number>;

  public readonly transactionItems?: TransactionItem[]

  public static associations: {
    transactionItems: Association<Transaction, TransactionItem>;
  };
}

export interface TransactionInput {
  customerId: string;
  shipmentDate: string;
  shipmentCost: number;
  items: TransactionItemInput[];
  total: number;
}
export interface TransactionItemInput {
  item: string;
  currentPrice: number;
  kilos: number;
  total: number;
}

export class TransactionItem extends Model<TransactionItems> implements TransactionItems {
  public id!: string
  public item!: string;
  public transactionId!: string;
  public currentPrice!: number;
  public kilos!: number;
  public total!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  declare getTransaction: BelongsToGetAssociationMixin<Transaction>;
  declare setTransaction: BelongsToSetAssociationMixin<Transaction, number>;
  
  public readonly transaction?: Transaction

  public static associations: {
    transaction: Association<TransactionItem, Transaction>;
  };
}

  export interface ListOpts {
    include?: any;
    where?: any;
    limit?: number;
    offset?: number;
    order?: any;
    attributes?: any;
    distinct?: boolean;
    group?: any;
  }

  export interface FiltersTransactions {
    customerId: string;
    shipmentDate?: string;
    limit?: number;
    offset?: number;
    order?: string;
  }
  export interface TransactionList {
    total: number;
    filters: FiltersTransactions;
    data: Transaction[];
  }