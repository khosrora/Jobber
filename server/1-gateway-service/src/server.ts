import { Application, json, NextFunction, Request, Response, urlencoded } from 'express';
import { Logger } from 'winston';
import { winstonLogger } from './utils/Logger';
import { StatusCodes } from 'http-status-codes';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { CustomError, IErrorResponse } from '@gateway/utils/error-handler';
import http from 'http';
import { config } from '@gateway/config';
import { elasticsearch } from './elasticsearch';
import { appRoutes } from '@gateway/routes';
import { axiosAuthInstance } from '@gateway/services/api/auth.service';

const SERVER_PORT = 4000;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatwayServer', 'debug');

export class GetwayServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private securityMiddleware(app: Application): void {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 360000,
        secure: config.NODE_ENV !== 'development' //* update with value from config
        //! sameSite : none
      })
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
      })
    );

    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
      }
      next();
    });
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(json({ limit: '200mb' }));
    app.use(urlencoded({ extended: true, limit: '200mb' }));
  }

  private routesMiddleware(app: Application): void {
    appRoutes(app);
  }

  private startElasticSearch(): void {
    elasticsearch.checkConnection();
  }

  private errorHandler(app: Application): void {
    app.use('*', (req: Request, res: Response, next: NextFunction) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist' });
      next();
    });
    app.use((error: IErrorResponse, req: Request, res: Response, next: NextFunction) => {
      log.log('error', `Getway Service ${error.comingFrom} : `, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    });
  }

  private async startServer(app: Application): Promise<void> {
    const httpServer: http.Server = new http.Server(app);
    this.startHttpServer(httpServer);
  }

  private async startHttpServer(httpServer: http.Server): Promise<void> {
    try {
      log.info(`Getway server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        log.info(`Getway server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      log.log('error', `Getway Service Start Server () error method `, error);
    }
  }
}
