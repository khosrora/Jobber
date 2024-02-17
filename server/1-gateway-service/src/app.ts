import express, { Express } from 'express';
import { GetwayServer } from '@gateway/server';

class Application {
  public initialize(): void {
    const app: Express = express();
    const server: GetwayServer = new GetwayServer(app);
    server.start();
  }
}

const application: Application = new Application();
application.initialize();
