import { databaseConnection } from '@users/database';
import { config } from '@users/config';
import express, { Express } from 'express';
import { start } from '@users/server';

const initialize = (): void => {
  config.cloudinaryConfig();
  databaseConnection();
  const app: Express = express();
  start(app);
};

initialize();
