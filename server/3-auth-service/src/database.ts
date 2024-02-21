import { Logger } from 'winston';
import { config } from '@auth/config';
import { winstonLogger } from './utils/Logger';
import { Sequelize } from 'sequelize';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'auth data base server', 'debug');

export const sequelize = new Sequelize(process.env.MYSQL_DB!, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true
  }
});

export async function databaseConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    log.info('AuthService Mysql database connection has been established successfully.');
  } catch (error) {
    log.error('Auth Service - Unable to connect to database.');
    log.log('error', 'AuthService databaseConnection() method error:', error);
  }
}
