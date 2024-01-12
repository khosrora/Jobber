import path from 'path';
import { IEmailLocals, winstonLogger } from '@khosrora/jobber-shared';
import { Logger } from 'winston';
import { config } from './config';
import nodemailer, { Transporter } from 'nodemailer';
import Email from 'email-templates';

const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mail transport helper', 'debug');

async function emailTemplates(templates: string, reciver: string, locals: IEmailLocals): Promise<void> {
  try {
    const smtTransport: Transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD
      }
    });

    const email: Email = new Email({
      message: {
        from: `Jobber App <${config.SENDER_EMAIL}>`
      },
      send: true,
      preview: false,
      transport: smtTransport,
      views: {
        options: {
          extension: 'ejs'
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build')
        }
      }
    });

    await email.send({
      template: path.join(__dirname, '..', 'src/emails', templates),
      message: {
        to: reciver
      },
      locals
    });
  } catch (error) {
    log.error(error);
  }
}

export { emailTemplates };
