import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export async function health(_req: Request, res: Response): Promise<void> {
  res.status(StatusCodes.OK).send('Users service is healthy and OK!!');
}
