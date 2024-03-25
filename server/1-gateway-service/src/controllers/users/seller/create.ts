import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { sellerService } from '@gateway/services/api/seller.service';
import { StatusCodes } from 'http-status-codes';

export class Create {
  public async seller(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.createSeller(req.body);
    res.status(StatusCodes.CREATED).json({ message: response.data.message, seller: response.data.user });
  }
}
