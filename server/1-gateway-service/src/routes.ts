import { Application } from 'express';
import { healthRoutes } from '@gateway/routes/health';

export const appRoutes = (app: Application) => {
  // http://localhost:4000/gateway
  app.use('', healthRoutes.routes());
};
