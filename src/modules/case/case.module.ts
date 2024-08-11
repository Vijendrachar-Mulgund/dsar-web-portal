import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CaseService } from '@app/modules/case/case.service';
import { CaseController } from '@app/modules/case/case.controller';
import { Case, CaseSchema } from '@app/schemas/case.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Case.name,
        schema: CaseSchema,
      },
    ]),
  ],
  providers: [CaseService],
  controllers: [CaseController],
})
export class CaseModule {}
