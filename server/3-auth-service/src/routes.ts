import { Application } from 'express';
import { verifyGatewayRequest } from '@auth/utils/gateway-middleware';

// ! routes
import { authRoutes } from '@auth/routes/auth';
import { currentUserRoutes } from '@auth/routes/current-user';
import { healthRoutes } from '@auth/routes/health';
import { searchRoutes } from '@auth/routes/search';
import { seedRoutes } from './routes/seed';

const BASE_PATH = '/api/v1/auth';

// http://localhost:4002/...
export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  app.use(BASE_PATH, searchRoutes());
  app.use(BASE_PATH, seedRoutes());

  app.use(BASE_PATH, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
}
