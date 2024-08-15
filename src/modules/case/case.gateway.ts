import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { CaseService } from '@app/modules/case/case.service';
import { Logger } from '@nestjs/common';

const os = require('os');

@WebSocketGateway({ cors: true, namespace: 'case' })
export class CaseGateway {
  constructor(private caseService: CaseService) {}
  @WebSocketServer() server: Server;

  private logger = new Logger(CaseGateway.name);
  private port = process.env.PORT;

  afterInit() {
    this.logger.log(
      `Nest JS Socket Server running on ${os.hostname()}:${this.port}`,
    );
  }

  @SubscribeMessage('get-all-cases')
  async getAllCases(): Promise<void> {
    const messages = await this.caseService.getAllCases();
    this.server.emit('all-cases', messages);
  }
}
