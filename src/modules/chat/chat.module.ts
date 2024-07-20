import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
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
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
