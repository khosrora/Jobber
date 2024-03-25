import { getRandomSellers, getSellerById, getSellerByUsername } from '@users/services/seller.service';
import { ISellerDocument } from '@users/utils';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const id = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerById(req.params.sellerId);
  res.status(StatusCodes.OK).json({ message: 'Seller profile.', seller });
};

const username = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument | null = await getSellerByUsername(req.params.username);
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

const random = async (req: Request, res: Response): Promise<void> => {
  const seller: ISellerDocument[] | null = await getRandomSellers(parseInt(req.params.size, 10));
  res.status(StatusCodes.OK).json({ message: 'Seller profile', seller });
};

export { id, username, random };
