import { Controller, Get, Inject, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { AppService } from './app.service';

@ApiTags('health')
@Controller('health')
export class AppController {
  constructor(@Inject(AppService) private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Check API and dependency connectivity' })
  async getHealth(@Res({ passthrough: true }) response: Response) {
    const health = await this.appService.checkHealth();
    if (health.status !== 'ok') {
      response.status(503);
    }
    return health;
  }
}
