import { Application } from 'express';

import { buyerRoutes } from '@users/routes/buyer';
import { verifyGatewayRequest } from '@users/utils';
import { healthRoutes } from '@users/routes/health';
import { sellerRoutes } from '@users/routes/seller';

const BUYER_BASE_PATH = '/api/v1/buyer';
const SELLER_BASE_PATH = '/api/v1/seller';

const appRoutes = (app: Application): void => {
  app.use(SELLER_BASE_PATH, healthRoutes());

  app.use(BUYER_BASE_PATH, verifyGatewayRequest, buyerRoutes());
  // app.use(SELLER_BASE_PATH, verifyGatewayRequest, () => console.log('seller routes'));
  app.use(SELLER_BASE_PATH, verifyGatewayRequest, sellerRoutes());
};

export { appRoutes };
