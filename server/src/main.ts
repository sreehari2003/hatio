import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.use(
    session({
      secret: process.env.SESSION_SECRET as string,
      saveUninitialized: false,
    }),
  );
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(8000);
}
bootstrap();
