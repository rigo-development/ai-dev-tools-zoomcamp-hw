import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Request, Response, NextFunction } from 'express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { ExecutionService } from './execution/execution.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)'],
      serveRoot: '/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway, ExecutionService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // SPA fallback middleware - serve index.html for non-file routes
    consumer
      .apply((req: Request, res: Response, next: NextFunction) => {
        // Skip API routes
        if (req.path.startsWith('/api')) {
          return next();
        }

        // Skip if path has a file extension (static assets)
        if (req.path.match(/\.\w+$/)) {
          return next();
        }

        // Serve index.html for SPA routes
        res.sendFile(join(__dirname, '..', 'client', 'index.html'));
      })
      .forRoutes('*');
  }
}
