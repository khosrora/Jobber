import client, { Channel, Connection } from 'amqplib';
import { config } from '@auth/config';
import { Logger } from 'winston';
import { winstonLogger } from '@auth/utils/logger';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'auth service QUEUE connection', 'debug');



async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection: Connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('auth service connected to queue successfully...');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.log('error', 'auth service createConnection() method:', error);
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
