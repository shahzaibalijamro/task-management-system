// api/index.ts
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import type { Request, Response } from 'express';
import express from 'express';
import cors from 'cors';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const expressApp = express();

    // CORS on the Express layer (handles preflight OPTIONS properly)
    expressApp.use(
      cors({
        origin: 'https://task-management-system-nest.netlify.app', // exact origin required if credentials:true
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      }),
    );

    // Optional: quick handler for OPTIONS if you want explicit 204 responses
    expressApp.options('*', (req, res) => res.sendStatus(204));

    // Create Nest app using the same express instance
    const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
    // You can still enable CORS at Nest level (redundant), but express-level cors is what matters here:
    app.enableCors({
      origin: 'https://task-management-system-nest.netlify.app',
      credentials: true,
    });

    await app.init();

    cachedApp = expressApp; // cache the express app (callable)
  }
  return cachedApp;
}

export default async (req: Request, res: Response) => {
  const app = await bootstrap();
  // express app is a request handler: call it directly
  app(req, res);
};
