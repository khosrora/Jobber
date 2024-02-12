import express, { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

const router: Router = express.Router();

export function healthRoutes(): Router {
  router.get('/notificaton', (req: Request, res: Response) => {
    return res.json({ message: 'OK!' });
    // res.status(StatusCodes.OK).send('Notification service is healthy and OK !!!');
  });
  return router;
}
