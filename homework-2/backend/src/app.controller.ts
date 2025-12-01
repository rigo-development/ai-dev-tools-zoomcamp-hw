import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/api/health')
  getHealth(): string {
    return 'OK';
  }

  // SPA fallback - serve index.html for all non-API routes
  @Get('*')
  serveSPA(@Res() res: Response): void {
    res.sendFile(join(__dirname, '..', 'client', 'index.html'));
  }
}
