import { create } from 'domain';
import { log } from '../../config';
import { Op } from 'sequelize';
import { APIError } from '../../entrypoint/rest/middleware/error';
import { DBClient } from '../../infrastructure/db-client'
import { encrypt } from '../util/tools';
import { Repository } from './interfaces';
import { Customer, CustomerInput, CustomerList, CustomerReturn, FiltersCustomers, FiltersPayments, FiltersTransactions, Item, ListOpts, Payment, PaymentInput, PaymentList, Transaction, TransactionInput, TransactionItem, TransactionList, User, UserReturn } from './models';
// import { Party, Participant, ListOpts, PartyReturn, PartyInput } from './models';
// import { Op } from 'sequelize'

export class DBService implements Repository {

  constructor(
      private dbClient: DBClient,
  ){}
  async addPayment(request: PaymentInput): Promise<string> {
    const pymt = request as unknown
    const createdPayment = await Payment.create(pymt as Payment)
    return createdPayment.id
  }
  async listPayments(filters: FiltersPayments): Promise<PaymentList> {
    var options: ListOpts = {
      where: {},
      include: []
    };

    if (filters.customerId != undefined) {
      options.where.customerId = { [Op.eq]: filters.customerId };
    } 
    if (filters.paymentDate != undefined) {
      options.where.paymentDate = { [Op.eq]: filters.paymentDate };
    } 

    const totalCount = await Payment.count(options);
  
    // pagination
    if (filters.limit != undefined) {
      options.limit = filters.limit;
    }
    if (filters.offset != undefined) {
      options.offset = filters.offset;
    }
    var orderArray: any[][] = [];
    if (filters.order == undefined) {
      filters.order = "createdAt,DESC"
    }
    var arrayItem = filters.order.split(",");
    orderArray.push(arrayItem);
    options.order = orderArray;
    const data =  await Payment.findAll(options)
    return {
      total: totalCount,
      filters: filters,
      data: data
    }
  }
  async verifyPayment(paymentId: string): Promise<void> {
    const pymt = await Payment.findByPk(paymentId)
    if (pymt == null) {
      throw new APIError('Not found')
    }
    if (pymt.verified == true) {
      return
    }
    await pymt.update({ verified: true})
    await this.subtractFromCustomerBalance(pymt.customerId, pymt.amount)
  }
  
  async getTransaction(customerId: string, transactionId: string): Promise<Transaction> {
    var options: ListOpts = {
      where: {
        id: transactionId,
        customerId: customerId
      },
      include: [
        { model: TransactionItem, 
          required: false
        }
      ]
    };
    const response = await Transaction.findOne(options)
    if (response == null) {
      throw new APIError('Not found')
    }
    
    return response
  }
  
  async listTransactions(filters: FiltersTransactions): Promise<TransactionList> {
    var options: ListOpts = {
      where: {},
      include: []
    };

    if (filters.customerId != undefined) {
      options.where.customerId = { [Op.eq]: filters.customerId };
    } 
    if (filters.shipmentDate != undefined) {
      options.where.shipmentDate = { [Op.eq]: filters.shipmentDate };
    } 

    const totalCount = await Transaction.count(options);
    options.include = [
      { model: TransactionItem, 
        required: false
      }
    ]
    // pagination
    if (filters.limit != undefined) {
      options.limit = filters.limit;
    }
    if (filters.offset != undefined) {
      options.offset = filters.offset;
    }
    var orderArray: any[][] = [];
    if (filters.order == undefined) {
      filters.order = "createdAt,DESC"
    }
    var arrayItem = filters.order.split(",");
    orderArray.push(arrayItem);
    options.order = orderArray;
    const data =  await Transaction.findAll(options)
    return {
      total: totalCount,
      filters: filters,
      data: data
    }
  }

  async getCustomer(customerId: string): Promise<CustomerReturn> {
    const cust = await Customer.findByPk(customerId);
    if (cust == null) {
      throw new APIError('Not found')
    }
    return {
        id: cust.id,
        name: cust.name,
        balance: cust.balance,
      }
  }

  async listCustomers(filters: FiltersCustomers): Promise<CustomerList> {
    var options: ListOpts = {
      where: {},
      include: []
    };

    if (filters.name != undefined) {
      options.where.name = { [Op.iLike]: "%" + filters.name + "%" };
    } 

    const totalCount = await Customer.count(options);
    // pagination
    if (filters.limit != undefined) {
      options.limit = filters.limit;
    }
    if (filters.offset != undefined) {
      options.offset = filters.offset;
    }
    var orderArray: any[][] = [];
    if (filters.order == undefined) {
      filters.order = "name,ASC"
    }
    var arrayItem = filters.order.split(",");
    orderArray.push(arrayItem);
    options.order = orderArray;
    const data =  await Customer.findAll(options)
    return {
      total: totalCount,
      filters: filters,
      data: data
    }
  }

  async addToCustomerBalance(customerId: string, amount: number): Promise<void> {
    const cust = await Customer.findByPk(customerId);
    if (cust == null) {
      throw new APIError('Not found')
    }
    await cust.update({ balance: cust.balance + amount });
  }

  async subtractFromCustomerBalance(customerId: string, amount: number): Promise<void> {
    const cust = await Customer.findByPk(customerId);
    if (cust == null) {
      throw new APIError('Not found')
    }
    await cust.update({ balance: cust.balance - amount });
  }

  async createCustomer(request: Customer): Promise<string> {
    const existing = await Customer.findOne({
      where: {
        name: request.name
      }
    });
    if (existing != null) {
      throw new APIError('Customer already exists')
    }
    // create customer
    const customer = await Customer.create(request);
    return customer.id as string
  }

  async addItem(name: string): Promise<void> {
    const existing = await Item.findOne({
      where: {
        name: name
      }
    });
    if (existing != null) {
      return
    }
    await Item.create({
      name: name
    });
  }

  async listItems(): Promise<string[]> {
    const returnValue: string[] = []
    const items = await Item.findAll();
    for (var item of items) {
      returnValue.push(item.name)
    }
    return returnValue.sort()
  }

  async updatePassword(username: string, newPassword: string): Promise<void> {
    let options: ListOpts = {
      where: {
        username: username
      },
      include: []
    };
    const user = await User.findOne(options);
    if (user == null) {
      throw new APIError('User not found')
    }
    await user.update({ encryptedPassword: newPassword });
  }
  
  async getUser(username: string, password: string): Promise<User | null> {
    let options: ListOpts = {
          where: {
            username: username,
            encryptedPassword: password
          },
          include: []
        };
    return await User.findOne(options);
  }

  async createUser(user: User): Promise<string> {
    const existing = await User.findOne({
      where: {
        username: user.username
      }
    });
    if (existing != null) {
      throw new APIError('User already exists')
    }
    const createdUser = await User.create(user);
    return createdUser.id
  }

  async addTransaction(request: TransactionInput): Promise<string> {
    const txn = request as unknown
    const createdTransaction = await Transaction.create(txn as Transaction)
    const txnItems = request.items as TransactionItem[]
    for (const item of txnItems) {
      item.transactionId = createdTransaction.id
      await TransactionItem.create(item)
    }
    await this.addToCustomerBalance(request.customerId, request.total)
    return createdTransaction.id
  }
}