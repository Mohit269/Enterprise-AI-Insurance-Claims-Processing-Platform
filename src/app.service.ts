import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Environment } from './config/environment.schema';
import { PrismaService } from './prisma/prisma.service';
import { REDIS_CLIENT } from './queue/redis.constants';
import type Redis from 'ioredis';

type DependencyStatus = 'up' | 'down';

export interface HealthReport {
  status: 'ok' | 'error';
  checks: {
    postgres: DependencyStatus;
    redis: DependencyStatus;
    qdrant: DependencyStatus;
  };
}

@Injectable()
export class AppService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    @Inject(ConfigService)
    private readonly config: ConfigService<Environment, true>,
  ) {}

  async checkHealth(): Promise<HealthReport> {
    const [postgres, redis, qdrant] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
      this.checkQdrant(),
    ]);
    const checks = { postgres, redis, qdrant };
    const status = Object.values(checks).every((check) => check === 'up')
      ? 'ok'
      : 'error';
    return { status, checks };
  }

  private async checkPostgres(): Promise<DependencyStatus> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return 'up';
    } catch {
      return 'down';
    }
  }

  private async checkRedis(): Promise<DependencyStatus> {
    try {
      return (await this.redis.ping()) === 'PONG' ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }

  private async checkQdrant(): Promise<DependencyStatus> {
    try {
      const apiKey = this.config.get('QDRANT_API_KEY', { infer: true });
      const response = await fetch(
        new URL('/healthz', this.config.get('QDRANT_URL', { infer: true })),
        {
          headers: apiKey ? { 'api-key': apiKey } : undefined,
          signal: AbortSignal.timeout(3000),
        },
      );
      return response.ok ? 'up' : 'down';
    } catch {
      return 'down';
    }
  }
}
