import { validateEnvironment } from './environment.schema';

describe('validateEnvironment', () => {
  const validEnvironment = {
    DATABASE_URL: 'postgresql://claims:password@localhost:5432/claims_ai',
    REDIS_URL: 'redis://localhost:6379',
    QDRANT_URL: 'http://localhost:6333',
    JWT_ACCESS_SECRET: 'a-development-access-secret-with-32-chars',
    JWT_REFRESH_SECRET: 'a-development-refresh-secret-with-32-chars',
  };

  it('applies defaults to a valid minimal environment', () => {
    expect(validateEnvironment(validEnvironment)).toMatchObject({
      NODE_ENV: 'development',
      PORT: 3000,
      OPENAI_MODEL_FAST: 'gpt-4o-mini',
      CORS_ORIGINS: 'http://localhost:3000',
    });
  });

  it('rejects invalid environment values', () => {
    expect(() =>
      validateEnvironment({ ...validEnvironment, PORT: '70000' }),
    ).toThrow();
  });
});
