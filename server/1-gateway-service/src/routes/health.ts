import { Health } from '@gateway/controllers/health';
import { Get } from '@gateway/controllers/users/seller/get';
import express, { Router } from 'express';

class HealthRoutes {
  private router: Router;

  constructor() {
    this.router = express.Router();
  }

  public routes(): Router {
    
    this.router.get('/gateway', Health.prototype.health);
    this.router.get('/gateway/health_user', Get.prototype.health);

    return this.router;
  }
}

export const healthRoutes: HealthRoutes = new HealthRoutes();
