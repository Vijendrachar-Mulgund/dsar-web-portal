import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { CaseService } from '@app/modules/case/case.service';
import { HttpStatus, Logger } from '@nestjs/common';

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
    const cases = await this.caseService.getAllCases();

    // Construct the response
    const response = {
      statusCode: HttpStatus.OK,
      message: 'The case detail is fetched',
      data: cases,
    };

    // Emit the response to all the connected clients
    this.server.emit('all-cases', response);
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(client: any, payload: any): Promise<void> {
    // Join the room - Case
    client.join(payload?.caseId);

    // Fetch the case detail
    const caseDetail = await this.caseService.getCase(payload?.caseId);

    // Construct the response
    const response = {
      statusCode: HttpStatus.OK,
      message: 'The case detail is fetched',
      data: caseDetail,
    };

    // Emit the response to the entire room
    this.server.to(payload?.caseId).emit('case-detail', response);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: any, payload: any): void {
    client.leave(payload?.caseId);
  }
}
