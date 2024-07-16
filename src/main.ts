import { NestFactory } from '@nestjs/core';
import * as session from 'express-session';

import { AppModule } from './app.module';

const MongoStore = require('connect-mongo');

async function bootstrap() {
  // Nest Create new Server
  const app = await NestFactory.create(AppModule);

  // Get the Environment variables
  const port = process.env.PORT;
  const version = process.env.API_VERSION;
  const sessionSecret = process.env.SESSION_SECRET;
  const sessionCookieSecure = Boolean(process.env.SESSION_COOKIE_SECURE);
  const sessionCookieMaxAge = +process.env.SESSION_COOKIE_MAX_AGE;
  const sessionCookieName = process.env.SESSION_COOKIE_NAME;

  const sessionsDatabaseURL = process.env.SESSION_STORE_DATABASE_URL;

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
        secure: sessionCookieSecure,
        maxAge: sessionCookieMaxAge,
      },
    }),
  );

  // Global definitions
  app.setGlobalPrefix(`${version}/api`);

  // CORS Config
  app.enableCors();

  // Server Run 🚀
  await app.listen(port);
}
bootstrap();
