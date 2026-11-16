import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from '../src/app.controller';
import type { HealthReport } from '../src/app.service';
import { AppService } from '../src/app.service';
import { RequestIdMiddleware } from '../src/common/middleware/request-id.middleware';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';

describe('Health endpoint (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const healthReport: HealthReport = {
      status: 'ok',
      checks: { postgres: 'up', redis: 'up', qdrant: 'up' },
    };
    const moduleRef = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: { checkHealth: jest.fn().mockResolvedValue(healthReport) },
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    const requestIdMiddleware = new RequestIdMiddleware();
    app.use(requestIdMiddleware.use.bind(requestIdMiddleware));
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('returns a wrapped health report with a request id', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/health')
      .expect(200);
    expect(response.headers['x-request-id']).toBeDefined();
    expect(response.body.data).toEqual({
      status: 'ok',
      checks: { postgres: 'up', redis: 'up', qdrant: 'up' },
    });
    expect(response.body.meta.requestId).toBe(response.headers['x-request-id']);
  });
});
