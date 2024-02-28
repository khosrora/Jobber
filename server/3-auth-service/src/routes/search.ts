import express, { Router } from 'express';

// ! controllers
import { gigs, singleGigById } from '@auth/controllers/search';

const router: Router = express.Router();

export function searchRoutes(): Router {
  router.get('/search/gig/:from/:size/:type', gigs);
  router.get('/search/gig/:id', singleGigById);

  return router;
}
