import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private chatService: ChatService) {}

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

  @SubscribeMessage('chatToServer')
  handleMessage(client: Socket, message: string): void {
    this.chatService.processMessage(message).then((response) => {
      this.server.emit('chatToClient', {
        sender: 'AI',
        message: response,
      });
    });
  }
}
