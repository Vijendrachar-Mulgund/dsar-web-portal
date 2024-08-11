import { Module } from '@nestjs/common';
import { ArtificialIntelligenceService } from './artificial-intelligence.service';
import { ArtificialIntelligenceController } from './artificial-intelligence.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ArtificialIntelligence,
  ArtificialIntelligenceSchema,
} from 'src/schemas/artificial-intelligence.schema';
import { UsersModule } from '../users/users.module';

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
})
export class ArtificialIntelligenceModule {}
