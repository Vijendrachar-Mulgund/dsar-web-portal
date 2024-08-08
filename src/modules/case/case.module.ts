import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  providers: [CaseService],
  controllers: [CaseController],
})
export class CaseModule {}
