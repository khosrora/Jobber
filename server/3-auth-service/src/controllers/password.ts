import { BadRequestError } from '@auth/utils/error-handler';
import { Request, Response } from 'express';
import { changePasswordSchema, emailSchema, passwordSchema } from '@auth/schemes/password';
import { IAuthDocument, IEmailMessageDetails } from '@auth/utils/auth.interface';
import {
  getAuthUserByEmail,
  getAuthUserByPasswordToken,
  getAuthUserByUsername,
  updatePassword,
  updatePasswordToken
} from '@auth/services/auth.service';
import crypto from 'crypto';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';
import { AuthModel } from '@auth/models/auth.schema';

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(emailSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'password forgotPassword() method Error 1');
  }
  const { email } = req.body;
  const existingUser: IAuthDocument = await getAuthUserByEmail(email);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'password forgotPassword() method Error 1');
  }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const date: Date = new Date();
  date.setHours(date.getHours() + 1);
  await updatePasswordToken(existingUser.id!, randomCharacters, date);
  const resetLink = `${config.CLIENT_URL}/reset_password?token=${randomCharacters}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: existingUser.email,
    resetLink,
    username: existingUser.username,
    template: 'forgotPassword'
  };
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Forgot password message sent to notification service'
  );
  res.status(StatusCodes.OK).json({ message: 'Password reset email sent .' });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(passwordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'password resetPassword() method Error 1');
  }
  const { password, confirmPassword } = req.body;
  const { token } = req.params;
  if (password !== confirmPassword) {
    throw new BadRequestError('Passwords do not match', 'password resetPassword() method Error 1');
  }
  const existingUser: IAuthDocument = await getAuthUserByPasswordToken(token);
  if (password !== confirmPassword) {
    throw new BadRequestError('Reset token has expired', 'password resetPassword() method Error 1');
  }
  const hashedPassword: string = await AuthModel.prototype.hashedPassword(password);
  await updatePassword(existingUser.id!, hashedPassword);
  const messageDetails: IEmailMessageDetails = {
    username: existingUser.username,
    template: 'resetPasswordSuccess'
  };
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Reset password message sent to notification service'
  );
  res.status(StatusCodes.OK).json({ message: 'Password successfully updated .' });
}

export async function changePassword(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(changePasswordSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'password changePassword() method Error 1');
  }
  const { currentPassword, newPassword } = req.body;
  if (currentPassword !== newPassword) {
    throw new BadRequestError('Invalid password', 'password changePassword() method Error 1');
  }
  const existingUser: IAuthDocument = await getAuthUserByUsername(`${req.currentUser?.username}`);
  if (!existingUser) {
    throw new BadRequestError('Invalid Password', 'password changePassword() method Error 1');
  }
  const hashedPassword: string = await AuthModel.prototype.hashedPassword(newPassword);
  await updatePassword(existingUser.id!, hashedPassword);
  const messageDetails: IEmailMessageDetails = {
    username: existingUser.username,
    template: 'resetPasswordSuccess'
  };
  await publishDirectMessage(
    authChannel,
    'jobber-email-notification',
    'auth-email',
    JSON.stringify(messageDetails),
    'Password change success message sent to notification service'
  );
  res.status(StatusCodes.OK).json({ message: 'Password successfully updated .' });
}
