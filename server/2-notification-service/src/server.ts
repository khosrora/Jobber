import 'express-async-errors';
import http from 'http';
import { Application } from 'express';

import { Logger } from 'winston';
import { winstonLogger } from '@khosrora/jobber-shared';

import { config } from '@notifications/config';
import { healthRoutes } from '@notifications/routes';
import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification Server', 'debug');

export function start(app: Application): void {
  startServer(app);

  // http:localhost:4001/notificaton-health
  app.use('', healthRoutes);
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  await createConnection();
}

function startElasticSearch(): void {
  checkConnection();
}

function startServer(app: Application): void {
  try {
    const httpServer: http.Server = new http.Server(app);
    log.info(`worker with process id of ${process.pid} on notification server has started`);
    httpServer.listen(SERVER_PORT, () => {
      log.info(`notification server running on port ${SERVER_PORT}`);
    });
  } catch (error) {
    log.log('error', 'NOTIFICATIONSERVICE Start server() method', error);
  }
}
