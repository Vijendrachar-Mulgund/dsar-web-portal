import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtificialIntelligenceService } from '@app/modules/artificial-intelligence/artificial-intelligence.service';
import { ArtificialIntelligenceController } from '@app/modules/artificial-intelligence/artificial-intelligence.controller';

import {
  ArtificialIntelligence,
  ArtificialIntelligenceSchema,
} from '@app/schemas/artificial-intelligence.schema';

import { UsersModule } from '@app/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ArtificialIntelligence.name,
        schema: ArtificialIntelligenceSchema,
      },
    ]),
    UsersModule,
  ],
  providers: [ArtificialIntelligenceService],
  controllers: [ArtificialIntelligenceController],
  exports: [ArtificialIntelligenceService],
})
export class ArtificialIntelligenceModule {}
