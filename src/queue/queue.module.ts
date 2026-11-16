import { Module } from '@nestjs/common';
import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_CLIENT,
      useExisting: RedisService,
    },
  ],
  exports: [REDIS_CLIENT, RedisService],
})
export class QueueModule {}
