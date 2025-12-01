import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { ExecutionService } from './execution/execution.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api/(.*)'],
      renderPath: '/*',  // SPA fallback - serve index.html for all non-file routes
    }),
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway, ExecutionService],
})
export class AppModule { }
