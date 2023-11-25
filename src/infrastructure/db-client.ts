import { Dialect, Sequelize, DataTypes } from 'sequelize'
import { Customer, Item, Payment, User, Transaction, TransactionItem } from '../component/repository/models'
// import { log } from '../config'

export interface Config {
  username: string;
  password: string;
  database: string;
  port: number;
  host: string;
  dialect: Dialect;
  logging: boolean;
}

export class DBClient {
  constructor(private connection: Sequelize) {
    this.setupTables();
    this.connection.sync();
  }

  setupTables() {
    User.init({
      id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
      username: { type: DataTypes.STRING, allowNull: false },
      encryptedPassword: { type: DataTypes.STRING, allowNull: false },
      userRole: { type: DataTypes.STRING, allowNull: false, defaultValue: 'customer' },
      customerId: { type: DataTypes.STRING, allowNull: true }
    }, {
        sequelize: this.connection,
        modelName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true,
        scopes: {
          stub: {
            attributes: { exclude: ['id', 'encryptedPassword', 'createdAt', 'updatedAt', 'deletedAt'] }
          }
        }
    });
    
    Item.init({
      name: { primaryKey: true, type: DataTypes.STRING, allowNull: false },
    }, {
        sequelize: this.connection,
        modelName: 'items',
        timestamps: true,
        paranoid: true,
        underscored: true
    });
    
    Customer.init({
      id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
      name: { type: DataTypes.STRING, allowNull: false },
      balance: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    }, {
        sequelize: this.connection,
        modelName: 'customers',
        timestamps: true,
        paranoid: true,
        underscored: true
    });
    
    Payment.init({
      id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
      customerId: { type: DataTypes.UUID, allowNull: false },
      paymentDate: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
      verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    }, {
        sequelize: this.connection,
        modelName: 'payments',
        timestamps: true,
        paranoid: true,
        underscored: true
    });

    Customer.hasMany(Payment, {
      foreignKey: 'customerId'
    });
    Payment.belongsTo(Customer, {
      foreignKey: 'customerId'
    });

    
    Transaction.init({
      id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
      customerId: { type: DataTypes.UUID, allowNull: false },
      shipmentDate: { type: DataTypes.STRING, allowNull: false },
      shipmentCost: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
      total: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    }, {
        sequelize: this.connection,
        modelName: 'transactions',
        timestamps: true,
        paranoid: true,
        underscored: true
    });

    Customer.hasMany(Transaction, {
      foreignKey: 'customerId'
    });
    Transaction.belongsTo(Customer, {
      foreignKey: 'customerId'
    }); 

    TransactionItem.init({
      id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
      transactionId: { type: DataTypes.UUID, allowNull: false },
      item: { type: DataTypes.STRING, allowNull: false },
      currentPrice: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
      kilos: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
      total: { type: DataTypes.DOUBLE, allowNull: false, defaultValue: 0 },
    }, {
        sequelize: this.connection,
        modelName: 'transaction_items',
        timestamps: true,
        paranoid: true,
        underscored: true
    });

    Transaction.hasMany(TransactionItem, {
      foreignKey: 'transactionId'
    });
    TransactionItem.belongsTo(Transaction, {
      foreignKey: 'transactionId'
    });
    

    // Party.init({
    //   id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    //   partyIdType: { type: DataTypes.STRING, allowNull: false },
    //   partyIdentifier: { type: DataTypes.STRING, allowNull: false },
    //   partySubIdOrType: { type: DataTypes.STRING, allowNull: true },
    //   currency: { type: DataTypes.STRING, allowNull: false }
    // }, {
    //     sequelize: this.connection,
    //     modelName: 'parties',
    //     timestamps: true,
    //     paranoid: true,
    //     underscored: true,
    //     scopes: {
    //       stub: {
    //         attributes: { exclude: ['id', 'createdAt', 'updatedAt', 'deletedAt', 'participantId'] }
    //       }
    //     }
    // });

    // Participant.init({
    //   id: { primaryKey: true, type: DataTypes.UUID, allowNull: false, defaultValue: DataTypes.UUIDV4 },
    //   fspId: { type: DataTypes.STRING, allowNull: false }
    // }, {
    //     sequelize: this.connection,
    //     modelName: 'participants',
    //     timestamps: true,
    //     paranoid: true,
    //     underscored: true,
    //     scopes: {
    //       stub: {
    //         attributes: { exclude: ['partyId', 'id', 'createdAt', 'updatedAt', 'deletedAt'] }
    //       }
    //     }
    // });

    // Participant.hasMany(Party, {
    //   foreignKey: 'participantId'
    // });
    // Party.belongsTo(Participant, {
    //   foreignKey: 'participantId'
    // });
  }

  updateTables() {
    // Participant.sync({ alter: true });
    // Party.sync({ alter: true });
  }

  getConnection(): Sequelize {
    return this.connection;
  }
}

export default DBClient;