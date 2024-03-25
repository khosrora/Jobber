import { Request, Response } from 'express';
import { BadRequestError } from '@auth/utils/error-handler';
import { loginSchema } from '@auth/schemes/signin';
import { isEmail } from '@auth/utils/helpers';
import { IAuthDocument } from '@auth/utils/auth.interface';
import { getAuthUserByUsername, getAuthUserByEmail, signToken } from '@auth/services/auth.service';
import { AuthModel } from '@auth/models/auth.schema';
import { omit } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export async function read(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(loginSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'signIn read() method Error 1');
  }
  const { username, password } = req.body;
  const isValidEmail: boolean = isEmail(username);
  const existingUser = !isValidEmail ? await getAuthUserByUsername(username) : await getAuthUserByEmail(username);
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials', 'signIn read() method Error 2');
  }
  const passwordsMatch: boolean = await AuthModel.prototype.comparePassword(password, existingUser.password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials', 'signIn read() method Error 2');
  }
  const userJWT: string = signToken(existingUser.id!, existingUser.email!, existingUser.username!);
  const userData: IAuthDocument = omit(existingUser, ['password']);
  res.status(StatusCodes.OK).json({ message: 'user login successfully', user: userData, token: userJWT });
}
