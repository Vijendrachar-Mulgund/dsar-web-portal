import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CaseService } from './case.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private caseService: CaseService) {}

  @SubscribeMessage('chat-to-server')
  async handleMessage(client: Socket, prompt: string): Promise<void> {
    console.log('Prompt', prompt);
    const promptJSON = JSON.parse(prompt);

    const response = await this.caseService.chatGPT(
      promptJSON.room,
      promptJSON.message,
    );

    console.log('response');

    this.server.emit('chat-to-client', {
      sender: 'AI',
      message: response,
    });
  }
}
