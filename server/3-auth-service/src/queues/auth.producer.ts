import { config } from '@auth/config';
import { winstonLogger } from '@auth/utils/Logger';
import { Channel } from 'amqplib';
import { Logger } from 'winston';
import { createConnection } from '@auth/queues/connection';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'auth service producer', 'debug');

export async function publishDirectMessage(
  channel: Channel,
  exchangeNmae: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }
    await channel.assertExchange(exchangeNmae, 'direct');
    channel.publish(exchangeNmae, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'Auth service provider publishDirectMessage() method error : ', error);
  }
}
