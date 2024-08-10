import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

const os = require('os');

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server: Server;

  private logger = new Logger(ChatGateway.name);
  private port = process.env.PORT;

  afterInit() {
    this.logger.log(
      `Nest JS Socket Server running on ${os.hostname()}:${this.port}`,
    );
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
