import express, { Router } from 'express';

// ! controllers
import { health } from '@auth/controllers/health';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/auth-health', health);

  return router;
}
