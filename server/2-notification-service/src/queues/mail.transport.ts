import { winstonLogger } from '@khosrora/jobber-shared';
import { config } from '@notifications/config';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Mail transport', 'debug');

async function sendEmail(template: string, reciveEmail: string, locals: any): Promise<void> {
  try {
    // email template
    log.info('email send successfully . ');
  } catch (error) {
    log.log('error', 'notification service Mail transport sendEmail() method Error : ', error);
  }
}

export { sendEmail };
