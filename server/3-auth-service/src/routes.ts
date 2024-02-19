import { Application } from 'express';
import { authRoutes } from '@auth/routes/auth';
import { verifyGatewayRequest } from '@auth/utils/gateway-middleware';

const BASE_PATH = '/api/v1/auth';
export function appRoutes(app: Application): void {
  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
}
