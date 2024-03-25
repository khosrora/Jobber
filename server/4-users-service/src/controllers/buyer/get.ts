import { getBuyerByEmail } from '@users/services/buyer.service';
import { IBuyerDocument } from '@users/utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const email = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.email);
  res.status(StatusCodes.OK).json({
    message: 'Buyer Profile',
    buyer
  });
};

const currentUsername = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.currentUser!.username);
  res.status(StatusCodes.OK).json({
    message: 'Buyer Profile',
    buyer
  });
};

const username = async (req: Request, res: Response): Promise<void> => {
  const buyer: IBuyerDocument | null = await getBuyerByEmail(req.params!.username);
  res.status(StatusCodes.OK).json({
    message: 'Buyer Profile',
    buyer
  });
};

export { email, username, currentUsername };
