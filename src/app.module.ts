import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './config/config.module';
import { RequestIdMiddleware } from './common/middleware/request-id.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { QueueModule } from './queue/queue.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ClaimsModule } from './modules/claims/claims.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { PoliciesModule } from './modules/policies/policies.module';
import { DocumentAiModule } from './modules/document-ai/document-ai.module';
import { RagModule } from './modules/rag/rag.module';
import { AssessmentModule } from './modules/assessment/assessment.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AuditModule } from './modules/audit/audit.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    EnvironmentConfigModule,
    PrismaModule,
    QueueModule,
    AuthModule,
    UsersModule,
    ClaimsModule,
    DocumentsModule,
    PoliciesModule,
    DocumentAiModule,
    RagModule,
    AssessmentModule,
    WorkflowModule,
    ReviewsModule,
    AuditModule,
    NotificationsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestIdMiddleware).forRoutes('{*path}');
  }
}
