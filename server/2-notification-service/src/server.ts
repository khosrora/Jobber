import 'express-async-errors';
import http from 'http';
import { Application } from 'express';

import { Logger } from 'winston';

import { config } from '@notifications/config';
import { healthRoutes } from '@notifications/routes';

import { checkConnection } from '@notifications/elasticsearch';
import { createConnection } from '@notifications/queues/connection';
import { Channel } from 'amqplib';
import { consumeAuthEmailMessages, consumeOrderEmailMessages } from '@notifications/queues/email.consume';
import { winstonLogger } from './utils/Logger';

const SERVER_PORT = 4001;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification Server', 'debug');

export function start(app: Application): void {
  startServer(app);

  // http:localhost:4001/notificaton
  app.use('', healthRoutes());
  startQueues();
  startElasticSearch();
}

async function startQueues(): Promise<void> {
  const emailChannel: Channel = (await createConnection()) as Channel;
  await consumeAuthEmailMessages(emailChannel);
  await consumeOrderEmailMessages(emailChannel);

  const verificationLink = `${config.CLIENT_URL}/confirm_email?v_token=2213123123fanfla`;
  const messageDetails: any = {
    receiverEmail: `${config.SENDER_EMAIL}`,
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  await emailChannel.assertExchange('jobber-order-notification', 'direct');

  // const message = JSON.stringify({ name: 'khosro', familly: 'ra' });
  const message1 = JSON.stringify(messageDetails);
  emailChannel.publish('jobber-order-notification', 'order-email', Buffer.from(message1));
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
