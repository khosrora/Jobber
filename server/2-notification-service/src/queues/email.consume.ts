import { Channel, ConsumeMessage } from 'amqplib';
import { IEmailLocals, winstonLogger } from '@khosrora/jobber-shared';
import { config } from '@notifications/config';
import { Logger } from 'winston';
import { createConnection } from '@notifications/queues/connection';
import { sendEmail } from '@notifications/queues/mail.transport';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'email Consumer', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchangeName = 'jobber-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');

    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      console.log(JSON.parse(msg!.content.toString()));
      // send emails
      // acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'Notification service error email consumer consumeAuthEmailMessages() method error:', error);
  }
}

async function consumeOrderEmailMessages(channel: Channel): Promise<void> {
  try {
    if (!channel) {
      channel = (await createConnection()) as Channel;
    }

    const exchangeName = 'jobber-order-notification';
    const routingKey = 'order-email';
    const queueName = 'order-email-queue';

    await channel.assertExchange(exchangeName, 'direct');

    const jobberQueue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false
    });

    await channel.bindQueue(jobberQueue.queue, exchangeName, routingKey);

    channel.consume(jobberQueue.queue, async (msg: ConsumeMessage | null) => {
      const {
        receiverEmail,
        username,
        template,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      } = JSON.parse(msg!.content.toString());
      const locals: IEmailLocals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/YLkN36V/unnamed.png',
        username,
        sender,
        offerLink,
        amount,
        buyerUsername,
        sellerUsername,
        title,
        description,
        deliveryDays,
        orderId,
        orderDue,
        requirements,
        orderUrl,
        originalDate,
        newDate,
        reason,
        subject,
        header,
        type,
        message,
        serviceFee,
        total
      };

      if (template === 'orderPlaced') {
        await sendEmail('orderPlaced', receiverEmail, locals);
        await sendEmail('orderReceipt', receiverEmail, locals);
      } else {
        await sendEmail('orderPlaced', receiverEmail, locals);
      }
      // await sendEmail(template, receiverEmail, locals);
      // acknowledge
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'Notification service error email consumer consumeOrderEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages, consumeOrderEmailMessages };
