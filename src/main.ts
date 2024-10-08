import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import * as session from 'express-session';

import { AppModule } from '@app/app.module';
import { databaseConnectionUrl } from '@app/utils/config/mongodb';

const MongoStore = require('connect-mongo');
const os = require('os');

async function bootstrap() {
  // Nest Create new Server
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Trust the first proxy // Only on Production
  if (process.env.NODE_ENV === 'production') app.set('trust proxy', true);

  // Get the Environment variables
  const port = process.env.PORT;
  const version = process.env.API_VERSION;
  const sessionSecret = process.env.SESSION_SECRET;
  const sessionCookieMaxAge = +process.env.SESSION_COOKIE_MAX_AGE;
  const sessionCookieName = process.env.SESSION_COOKIE_NAME;

  const sessionsDatabaseURL = databaseConnectionUrl(
    process.env.SESSION_STORE_DATABASE_URL,
    process.env.SESSION_STORE_DATABASE_NAME,
    process.env.SESSION_STORE_DATABASE_USERNAME,
    process.env.SESSION_STORE_DATABASE_PASSWORD,
  );

  const sessionsDatabase = MongoStore.create({
    mongoUrl: sessionsDatabaseURL,
  });

  // Initialize the Cookie Session
  app.use(
    session({
      name: sessionCookieName,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      store: sessionsDatabase,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: sessionCookieMaxAge,
      },
    }),
  );

  Logger.log(
    `Environment: ${process.env.NODE_ENV}, Check: ${process.env.NODE_ENV === 'production'}`,
    'Environment',
  );

  // Global definitions
  app.setGlobalPrefix(`${version}/api`);

  // CORS Config
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Server Run 🚀
  await app.listen(port);

  Logger.log(
    `Nest JS RESTful API Server running on ${os.hostname()}:${port}`,
    'Bootstrap',
  );
}
bootstrap();
