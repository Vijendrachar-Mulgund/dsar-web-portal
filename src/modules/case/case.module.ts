import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CaseService } from '@app/modules/case/case.service';
import { CaseController } from '@app/modules/case/case.controller';
import { Case, CaseSchema } from '@app/schemas/case.schema';
import { ChatModule } from '@app/modules/chat/chat.module';
import { CaseGateway } from '@app/modules/case/case.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Case.name,
        schema: CaseSchema,
      },
    ]),
    forwardRef(() => ChatModule),
  ],
  providers: [CaseService, CaseGateway],
  controllers: [CaseController],
  exports: [CaseService, CaseGateway],
})
export class CaseModule {}
