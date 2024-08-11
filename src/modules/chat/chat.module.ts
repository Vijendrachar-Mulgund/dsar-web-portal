import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ChatService } from '@app/modules/chat/chat.service';
import { ChatGateway } from '@app/modules/chat/chat.gateway';
import { Message, MessageSchema } from '@app/schemas/message.schema';
import { ChatController } from '@app/modules/chat/chat.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
