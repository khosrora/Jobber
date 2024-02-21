import express, { Router } from 'express';
import { read, resendEmail } from '@auth/controllers/current-user';
import { token } from '@auth/controllers/refresh-token';

// ! controllers

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('refresh-token', token);
  router.get('currentuser', read);
  router.post('resend-email', resendEmail);

  return router;
}
