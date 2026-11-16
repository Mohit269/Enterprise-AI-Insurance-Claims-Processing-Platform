import type { OnModuleDestroy } from '@nestjs/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import type { Environment } from '../config/environment.schema';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private connectionErrorLogged = false;

  constructor(@Inject(ConfigService) config: ConfigService<Environment, true>) {
    super(config.get('REDIS_URL', { infer: true }), {
      maxRetriesPerRequest: null,
      commandTimeout: 3000,
    });
    this.on('error', (error: Error) => {
      if (!this.connectionErrorLogged) {
        this.logger.error('Redis connection error', error.stack);
        this.connectionErrorLogged = true;
      }
    });
    this.on('ready', () => {
      this.connectionErrorLogged = false;
    });
  }

  onModuleDestroy(): void {
    this.disconnect();
  }
}
