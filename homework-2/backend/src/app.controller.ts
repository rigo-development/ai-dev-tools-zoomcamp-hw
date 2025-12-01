import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/api/health')
  getHealth(): string {
    return 'OK';
  }

  @Get('/')
  getRoot(): string {
    return 'Backend is running! Access the Frontend service to use the application.';
  }
}
