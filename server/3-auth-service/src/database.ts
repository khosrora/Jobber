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
    log.info('AuthService MySql database connection has been established succefully');
  } catch (error) {
    log.error('auth server - unable to connect database');
    log.log('error', 'Auth service databaseConnection method error', error);
  }
}
