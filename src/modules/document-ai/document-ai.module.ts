import { Module } from '@nestjs/common';
import { DocumentAiController } from './document-ai.controller';
import { DocumentAiService } from './document-ai.service';

@Module({ controllers: [DocumentAiController], providers: [DocumentAiService] })
export class DocumentAiModule {}
