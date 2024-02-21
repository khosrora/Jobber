import { IAuthDocument } from '@auth/utils/auth.interface';
import { Request, Response } from 'express';
import { getAuthUserByVerificationToken, updateVerifyEmailField, getAuthUserById } from '@auth/services/auth.service';
import { BadRequestError } from '@auth/utils/error-handler';
import { StatusCodes } from 'http-status-codes';

export async function update(req: Request, res: Response): Promise<void> {
  const { token } = req.body;
  const checkIfUserExist: IAuthDocument = await getAuthUserByVerificationToken(token);
  if (!checkIfUserExist) {
    throw new BadRequestError('Veriication token is either invalid or is already used', 'verifyEmail update() method');
  }
  await updateVerifyEmailField(checkIfUserExist.id!, '', 1);
  const updatedUser = await getAuthUserById(checkIfUserExist.id!);
  res.status(StatusCodes.OK).json({ message: 'Email verified successfully.', user: updatedUser });
}
