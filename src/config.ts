import { Config as DatabaseConfig } from "./infrastructure/db-client";
// import { Config as ALSConfig } from "./infrastructure/als-client";
import { Dialect } from 'sequelize';

import dotenv from 'dotenv';
dotenv.config();

interface ServerConfig {
    hostname: string
    port: number
}

export const serverConfig = (): ServerConfig => {
    const { SERVER_HOSTNAME = '0.0.0.0', SERVER_PORT = '3000'} = process.env;
    return {
        hostname: SERVER_HOSTNAME,
        port: parseInt(SERVER_PORT, 10),
    }
}

export const databaseConfig = (): DatabaseConfig => {
    const dbName = process.env.DB_NAME as string
    const dbUser = process.env.DB_USERNAME as string
    const dbHost = process.env.DB_HOST as string
    const dbPort = process.env.DB_PORT as unknown as number
    const dbDriver = process.env.DB_DIALECT as Dialect || 'postgres'
    const dbPassword = process.env.DB_PASSWORD as string
    const dbLogging = process.env.DB_LOGGING === 'true'
    
    const configRead = {
        username: dbUser,
        password: dbPassword,
        database: dbName,
        port: dbPort,
        host: dbHost,
        dialect: dbDriver,
        logging: dbLogging,
    }
    return configRead;
}

// export const alsConfig = (): ALSConfig => {
//     const { MOJALOOP_ALS_URL, FSPIOP_API_VERSION } = process.env
//     return {
//         alsUrl: MOJALOOP_ALS_URL as string,
//         fspiopVersion: FSPIOP_API_VERSION as string
//     }
// }

export const log = require('custom-logger').config({ level: process.env.LOG_LEVEL as unknown as number, format: "[%timestamp%] %event%: %padding% %message%" });