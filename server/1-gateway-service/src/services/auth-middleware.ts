import { config } from '@gateway/config';
import { IAuthPayload } from '@gateway/utils/auth.interface';
import { NotAuthorizedError } from '@gateway/utils/error-handler';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

class AuthMiddleware {
  public verifyUser(req: Request, res: Response, next: NextFunction): void {
    if (!req.session?.jwt) {
      throw new NotAuthorizedError('Token is not available. Please login again', 'verifyUser() method');
    }

    try {
      const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload;
      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is not available. Please login again', 'verifyUser() invalid session method');
    }
    next();
  }

  public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Token is not available. Please login again', 'checkAuthentication() method');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
