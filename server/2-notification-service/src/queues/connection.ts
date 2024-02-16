import client, { Channel, Connection } from 'amqplib';
import { config } from '@notifications/config';
import { Logger } from 'winston';
import { winstonLogger } from '@notifications/utils/Logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification QUEUE connection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('notification service connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'Notification service createConnection() method:', error);
    return undefined;
  }
}

function closeConnection(channel: Channel, connection: Connection) {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection };
