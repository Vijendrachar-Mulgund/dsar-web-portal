import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { CaseService } from './case.service';
import { CaseController } from './case.controller';
import { Case, CaseSchema } from '../../schemas/Case.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Case.name,
        schema: CaseSchema,
      },
    ]),
  ],
  providers: [CaseService, ChatGateway],
  controllers: [CaseController],
})
export class CaseModule {}
