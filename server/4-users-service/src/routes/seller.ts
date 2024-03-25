import express, { Router } from 'express';

// ! controllers
import { seller as createSeller } from '@users/controllers/seller/create';
import { update as updateSeller } from '@users/controllers/seller/update';

import { id, username, random } from '@users/controllers/seller/get';
import { seed } from '@users/controllers/seller/seed';

const router: Router = express.Router();

const sellerRoutes = (): Router => {
  router.get('/id/:sellerId', id);
  router.get('/username/:username', username);
  router.get('/random/:size', random);

  router.post('/create', createSeller);
  router.put('/:sellerId', updateSeller);
  router.put('/seed/:count', seed);

  return router;
};

export { sellerRoutes };
