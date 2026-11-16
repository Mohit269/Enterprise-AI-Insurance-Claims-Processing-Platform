# Claims AI Platform

Initial scaffold for a health-insurance claims processing API. It contains no claim
processing logic, model calls, or workflow nodes. Use synthetic data only.

## Requirements

- Node.js 20.19 or newer and npm
- Docker with Docker Compose

## Local setup

```bash
npm install
cp .env.example .env
```

Replace the development placeholder secrets in `.env`. The API validates its
configuration at startup and exits when required values are missing or invalid.

Start PostgreSQL, Redis, and Qdrant:

```bash
docker compose up -d
```

Generate Prisma Client, apply the initial migration, then start the API:

```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run start:dev
```

The API listens at `http://localhost:3000`. Health checks are available at
`GET /api/v1/health`; Swagger is served at `/api/docs`.

## Environment variables

See [.env.example](./.env.example) for the full list and local development values.
The config schema validates environment, port, database/cache/vector URLs, JWT
secrets and token TTLs. Provider and AWS credentials can be left blank until those
integrations are configured. `CORS_ORIGINS` is a comma-separated origin allowlist.
`SEED_PASSWORD` is used only by the optional local Prisma seed command.

## Commands

```bash
npm run build
npm test
npm run test:e2e
npm run lint
npm run prisma:seed
npm run eval:run
```

## Layout

- `src/config`, `src/common`: runtime configuration and shared API infrastructure
- `src/prisma`, `src/storage`, `src/queue`: persistence and infrastructure adapters
- `src/ai`: reserved AI integration areas
- `src/modules`: self-contained domain modules
- `prisma`: schema, initial migration, and synthetic local seed
- `mcp-server`, `evals`, `docs`, `docker`, `test`: reserved platform tooling
