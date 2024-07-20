import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaseService } from './case.service';

@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private caseService: CaseService) {}

  @SubscribeMessage('chatToServer')
  async handleMessage(client: Socket, message: string): Promise<void> {
    const response = await this.caseService.processMessage(message);

    this.server.emit('chatToClient', {
      sender: 'AI',
      message: response,
    });
  }
}
