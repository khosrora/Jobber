import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import { sellerService } from '@gateway/services/api/seller.service';
import { StatusCodes } from 'http-status-codes';

export class Get {
  public async id(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerById(req.params.sellerId);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.user });
  }

  public async username(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerByUsername(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.user });
  }

  public async random(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await sellerService.getSellerById(req.params.username);
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.user });
  }

  public async health(_req: Request, res: Response): Promise<void> {
    console.log('object');
    return;
    const response: AxiosResponse = await sellerService.health();
    res.status(StatusCodes.OK).json({ message: response.data.message, seller: response.data.user });
  }
}
