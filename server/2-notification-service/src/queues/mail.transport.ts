import { IEmailLocals, winstonLogger } from '@khosrora/jobber-shared';
import { config } from '@notifications/config';
import { emailTemplates } from '@notifications/herlpers';
import { Logger } from 'winston';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'Mail transport', 'debug');

async function sendEmail(template: string, reciveEmail: string, locals: IEmailLocals): Promise<void> {
  try {
    // email template
    emailTemplates(template, reciveEmail, locals);
    log.info('email send successfully . ');
    
  } catch (error) {
    log.log('error', 'notification service Mail transport sendEmail() method Error : ', error);
  }
}

export { sendEmail };
