import { Signup } from '@gateway/controllers/auth/signup';
import { Signin } from '@gateway/controllers/auth/signin';
import express, { Router } from 'express';
import { VerifyEmail } from '@gateway/controllers/auth/verify-email';
import { Password } from '@gateway/controllers/auth/password';
import { AuthSeed } from '@gateway/controllers/auth/seed';

class AuthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    this.router.post('/auth/logout', Signup.prototype.logout);


    this.router.post('/auth/signup', Signup.prototype.create);
    this.router.post('/auth/signin', Signin.prototype.read);
    this.router.put('/auth/verify-email', VerifyEmail.prototype.update);

    this.router.put('/auth/forgot-password', Password.prototype.forgotPassword);
    this.router.put('/auth/reset-password/:token', Password.prototype.resetPassword);
    this.router.put('/auth/change-password', Password.prototype.changePassword);

    this.router.put('/auth/seed/:count', AuthSeed.prototype.create);

    return this.router;
  }
}

export const authRoutes: AuthRoutes = new AuthRoutes();
