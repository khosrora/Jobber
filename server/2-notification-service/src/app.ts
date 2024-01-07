import express, { Express } from 'express';
import { winstonLogger } from '@khosrora/jobber-shared';
import { Logger } from 'winston';
import { config } from '@notifications/config';
import { start } from '@notifications/server';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification app', 'debug');

function initialize(): void {
  const app: Express = express();
  start(app);
  log.info('notification service initilized');
}

initialize();
