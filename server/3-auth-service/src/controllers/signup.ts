import { signupSchema } from '@auth/schemes/signup';
import { createAuthUser, getAuthUserByUsernameOrEmail, signToken } from '@auth/services/auth.service';
import { IAuthDocument, IEmailMessageDetails } from '@auth/utils/auth.interface';
import { BadRequestError } from '@auth/utils/error-handler';
import { Request, Response } from 'express';
import { v4 as uuidV4 } from 'uuid';
import { UploadApiResponse } from 'cloudinary';
import { uploads } from '@auth/utils/cloudinary-upload';
import crypto from 'crypto';
import { firstLetterUppercase, lowerCase } from '@auth/utils/helper';
import { config } from '@auth/config';
import { publishDirectMessage } from '@auth/queues/auth.producer';
import { authChannel } from '@auth/server';
import { StatusCodes } from 'http-status-codes';

export async function create(req: Request, res: Response): Promise<void> {
  const { error } = await Promise.resolve(signupSchema.validate(req.body));
  if (error?.details) {
    throw new BadRequestError(error.details[0].message, 'signUp create() method Error 1');
  }
  const { username, email, password, country, profilePicture } = req.body;
  const checkIfUserExist: IAuthDocument = await getAuthUserByUsernameOrEmail(username, email);
  if (checkIfUserExist) {
    throw new BadRequestError('Invalid credentials. Email or username', 'signUp create() method Error 2');
  }
  const profilePublicId = uuidV4();
  // const uploadResult: UploadApiResponse = (await uploads(profilePicture, `${profilePublicId}`, true, true)) as UploadApiResponse;
  // if (!uploadResult.public_id) {
  //   throw new BadRequestError('File Upload Error . Try again', 'signUp create() method Error 3');
  // }
  const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
  const randomCharacters: string = randomBytes.toString('hex');
  const authData: IAuthDocument = {
    username: firstLetterUppercase(username),
    email: lowerCase(email),
    profilePublicId,
    password,
    country,
    // profilePicture: uploadResult?.secure_url,
    emailVerificationToken: randomCharacters
  } as IAuthDocument;
  const result: IAuthDocument = await createAuthUser(authData);
  const verificationLink = `${config.CLIENT_URL}/confirm_email?v-token=${authData.emailVerificationToken}`;
  const messageDetails: IEmailMessageDetails = {
    receiverEmail: result.email,
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
  const userJWT: string = signToken(result.id!, result.email!, result.username!);
  res.status(StatusCodes.CREATED).json({ message: 'user created successfully', user: result, token: userJWT });
}
