import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsGateway } from './events/events.gateway';
import { ExecutionService } from './execution/execution.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventsGateway, ExecutionService],
})
export class AppModule { }
