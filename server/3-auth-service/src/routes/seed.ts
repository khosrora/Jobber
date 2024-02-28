import express, { Router } from 'express';

// ! controllers
import { create } from '@auth/controllers/seeds';

const router: Router = express.Router();

export function seedRoutes(): Router {
  router.put('/seed/:count', create);

  return router;
}
