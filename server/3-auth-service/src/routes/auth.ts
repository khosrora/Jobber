import express, { Router } from 'express';
import { create } from '@auth/controllers/signup';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  return router;
}
