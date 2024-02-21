import { CurrentUser } from '@gateway/controllers/auth/current-user';
import express, { Router } from 'express';
import { authMiddleware } from '@gateway/services/auth-middleware';
import { Refresh } from '@gateway/controllers/auth/refresh-token';

class CurrentUserRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/refresh-token/:username', authMiddleware.checkAuthentication, Refresh.prototype.token);
    this.router.post('/auth/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);
    this.router.post('/auth/resend-email', authMiddleware.checkAuthentication, CurrentUser.prototype.resendEmail);
    return this.router;
  }
}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes();
