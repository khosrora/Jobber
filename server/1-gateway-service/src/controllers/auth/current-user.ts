import { authService } from '@gateway/services/api/auth.service';
import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class CurrentUser {
  public async read(_req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.getCurrentUser();
    res.status(StatusCodes.CREATED).json({ message: response.data.message, user: response.data.user });
  }

  public async resendEmail(req: Request, res: Response): Promise<void> {
    const response: AxiosResponse = await authService.resendEmail(req.body);
    res.status(StatusCodes.CREATED).json({ message: response.data.message, user: response.data.user });
  }
}
