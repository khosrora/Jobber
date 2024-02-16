import express, { Express } from 'express';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { start } from '@notifications/server';
import { winstonLogger } from './utils/Logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification app', 'debug');

function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('notification service initilized');
}

initialize();
