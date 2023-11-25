import express from 'express';
import { databaseConfig, serverConfig } from './config';
import { Sequelize } from 'sequelize';
import { log } from './config';
import { Server } from './entrypoint/rest/server';
import { DBClient } from './infrastructure/db-client';
import { UserService } from './component/user/service';
import { ItemService } from './component/item/service';
import { HealthCheckController } from './entrypoint/rest/health-check';
import { UserController } from './entrypoint/rest/controller/user';
import { DBService } from './component/repository/service';
import { ItemController } from './entrypoint/rest/controller/item';
import { CustomerController } from './entrypoint/rest/controller/customer';
import { CustomerService } from './component/customer/service';
import { TransactionService } from './component/transaction/service';
import { TransactionController } from './entrypoint/rest/controller/transaction';
import { PaymentService } from './component/payment/service';
import { PaymentController } from './entrypoint/rest/controller/payment';
// import { ALSClient } from './infrastructure/als-client';

export const createServer = async (): Promise<Server> => {
  // setup connection
  const repoConfig: any = databaseConfig();
  
  const connection = new Sequelize(repoConfig.database, repoConfig.username, repoConfig.password, {
    host: repoConfig.host,
    dialect: repoConfig.dialect,
    logging: (msg) =>log.debug(msg), 
    port: repoConfig.port
  })
  connection.authenticate().catch((error) => {
    log.error("unable to connect to the database: ", error)
  });

  // const mlConfig: any = alsConfig();
  // infrastructure
  const dbClient = new DBClient(connection);
  // const alsClient = new ALSClient(mlConfig)
  
  // services
  const dbService = new DBService(dbClient)
  const userService = new UserService(dbService)
  const itemService = new ItemService(dbService)
  const customerService = new CustomerService(dbService, userService)
  const transactionService = new TransactionService(dbService)
  const paymentService = new PaymentService(dbService)
  // middlewares

  // controllers
  const controllers = [
      new HealthCheckController(),
      new UserController(userService),
      new ItemController(itemService),
      new CustomerController(customerService),
      new TransactionController(transactionService),
      new PaymentController(paymentService)
  ]
  
  // rest entrypoint
  const expressInstance = express();
  const config = serverConfig();
  return new Server(expressInstance, controllers, config.hostname, config.port);
}