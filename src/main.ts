import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Nest Create new Server
  const app = await NestFactory.create(AppModule);

  // Get the Environment variables
  const port = process.env.PORT;
  const version = process.env.API_VERSION;

  // Global definitions
  app.setGlobalPrefix(`${version}/api`);

  // CORS Config
  app.enableCors();

  // Server Run 🚀
  await app.listen(port);
}
bootstrap();
