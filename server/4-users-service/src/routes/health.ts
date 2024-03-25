import express, { Router } from 'express';

// ! controllers

import { health } from '@users/controllers/health';

const router: Router = express.Router();

const healthRoutes = (): Router => {
  router.get('/health', health);

  return router;
};

export { healthRoutes };
