import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { sellerService } from '@gateway/services/api/seller.service';
import { StatusCodes } from 'http-status-codes';

export class SellerSeed {
  public async seller(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.seed(req.params.count);
    res.status(StatusCodes.OK).json({ message: response.data.message });
  }
}
