import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatService } from '@app/modules/chat/chat.service';
import { ChatGateway } from '@app/modules/chat/chat.gateway';
import { Message, MessageSchema } from '@app/schemas/message.schema';
import { ChatController } from '@app/modules/chat/chat.controller';
import { ArtificialIntelligenceModule } from '@app/modules/artificial-intelligence/artificial-intelligence.module';
import { CaseModule } from '@app/modules/case/case.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
    ArtificialIntelligenceModule,
    forwardRef(() => CaseModule),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
  exports: [ChatGateway],
})
export class ChatModule {}
