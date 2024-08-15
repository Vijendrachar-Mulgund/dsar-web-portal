import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ChatService } from '@app/modules/chat/chat.service';

const os = require('os');

@WebSocketGateway({ namespace: 'ai-chat', cors: true })
export class ChatGateway {
  constructor(private chatService: ChatService) {}
  @WebSocketServer() server: Server;

  private logger = new Logger(ChatGateway.name);
  private port = process.env.PORT;

  afterInit() {
    this.logger.log(
      `Nest JS Socket Server running on ${os.hostname()}:${this.port}`,
    );
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(client: any, payload: any): Promise<void> {
    client.join(payload?.caseId);

    const messages = await this.chatService.getAllMessages(payload?.caseId);

    client.emit('initial-messages', messages);
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): any {
    this.server.to(payload.case).emit('message', payload);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: any, payload: any): void {
    client.leave(payload?.caseId);
  }
}
