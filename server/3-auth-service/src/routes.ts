import { Application } from 'express';
import { authRoutes } from '@auth/routes/auth';
import { verifyGatewayRequest } from '@auth/utils/gateway-middleware';
import { currentUserRoutes } from '@auth/routes/current-user';
import { healthRoutes } from '@auth/routes/health';

const BASE_PATH = '/api/v1/auth';

// http://localhost:4002/...
export function appRoutes(app: Application): void {
  app.use('', healthRoutes);

  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
  // app.use(BASE_PATH, (req, res) => {
  //   console.log(req.headers);
  //   console.log(req.headers.gatewayToken);
  //   console.log(req.headers.gatewaytoken);
  // });
}
