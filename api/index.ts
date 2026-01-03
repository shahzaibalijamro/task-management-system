// api/index.ts
import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { Request, Response } from 'express';

// Cache the app instance
let cachedApp: INestApplication;

async function bootstrap() {
  if (!cachedApp) {
    // Create the NestJS app using the Express adapter
    const expressApp = require('express')();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    // Enable CORS if your frontend is on a different domain
    app.enableCors({
        origin: 'http://localhost:5173',
        credentials: true
    });

    await app.init();
    
    // Assign the underlying Express instance to the cached app
    cachedApp = app;
  }
  return cachedApp;
}

// This is the default export Vercel looks for
export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp(req, res);
};