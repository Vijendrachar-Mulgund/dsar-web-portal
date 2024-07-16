import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

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

  // Initialize the Cookie Session
  app.use(
    session({
      name: sessionCookieName,
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
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
