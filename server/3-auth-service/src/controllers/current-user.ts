import { getAuthUserByEmail, getAuthUserById, updateVerifyEmailField } from '@auth/services/auth.service';
import { IAuthDocument, IEmailMessageDetails } from '@auth/utils/auth.interface';
import { BadRequestError } from '@auth/utils/error-handler';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { lowerCase } from 'lodash';
import crypto from 'crypto';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';

export async function read(req: Request, res: Response): Promise<void> {
  let user = null;
  const existingUser: IAuthDocument = await getAuthUserById(req.currentUser!.id);
  if (Object.keys(existingUser).length) {
    user = existingUser;
  }
  res.status(StatusCodes.OK).json({ message: 'Authenticated user', user });
}

export async function resendEmail(req: Request, res: Response): Promise<void> {
  const { email, userId } = req.body;
  const chechIfUserExist: IAuthDocument = await getAuthUserByEmail(lowerCase(email));
  if (!chechIfUserExist) {
    throw new BadRequestError('Email is invalid', 'CurrentUser resentEmail() method Error');
  }

  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v-token=${randomCharacters}`;
  await updateVerifyEmailField(parseInt(userId), randomCharacters, 0);

  const messageDetails: IEmailMessageDetails = {
    receiverEmail: lowerCase(email),
    verifyLink: verificationLink,
    template: 'verifyEmail'
  };
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Verify email message has been sent to notification service .'
  );
  const updatedUser = await getAuthUserById(parseInt(userId));
  res.status(StatusCodes.CREATED).json({ message: 'user created successfully', user: updatedUser });
}
