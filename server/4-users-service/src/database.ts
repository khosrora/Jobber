import { Logger } from 'winston';
import { config } from '@users/config';
import { winstonLogger } from '@users/utils';
import mongoose from 'mongoose';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'user data base server', 'debug');

const databaseConnection = async (): Promise<void> => {
  try {
    await mongoose.connect(`${config.DATABASE_URL}`);
    log.info('Users service successfully connected to databse');
  } catch (error) {
    log.log('error', 'UsersService databaseConnection() method error : ', error);
  }
};

export { databaseConnection };
