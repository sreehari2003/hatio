import * as session from 'express-session';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

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
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(
    (process.env.PORT as string) || 8000,
    (process.env.HOST as string) || '0.0.0.0',
  );
}
bootstrap();
