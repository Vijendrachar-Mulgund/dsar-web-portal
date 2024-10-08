import { Logger } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { ChatService } from '@app/modules/chat/chat.service';
import { MessageDto } from '@app/modules/chat/dto/message.dto';
import { SenderType } from '@app/enums/sender-type.enum';
import { ArtificialIntelligenceService } from '@app/modules/artificial-intelligence/artificial-intelligence.service';
import { ArtificialIntelligenceModel } from '@app/enums/artificial-intelligence-models.enum';
import { CaseService } from '@app/modules/case/case.service';
import { CaseGateway } from '@app/modules/case/case.gateway';

const os = require('os');

@WebSocketGateway({ namespace: 'ai-chat', cors: true })
export class ChatGateway {
  constructor(
    private chatService: ChatService,
    private caseService: CaseService,
    private caseGateway: CaseGateway,
    private artificialIntelligenceService: ArtificialIntelligenceService,
  ) {}
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
    try {
      // The Client joins the room
      client.join(payload?.caseId);

      // Get the history of the room and it's chat and send it to the client
      const messages = await this.chatService.getAllMessages(payload?.caseId);

      // Send the history of the room to the client
      client.emit('initial-messages', messages);
    } catch (error) {
      this.server.to(payload?.caseId).emit('error', error.message);
    }
  }

  @SubscribeMessage('message')
  async handleMessage(client: any, payload: MessageDto): Promise<any> {
    try {
      const newMessage = await this.chatService.saveMessage(payload);

      // Send the user's message to everyone in the room
      this.server.to(payload.case).emit('message', newMessage);

      // Get the context in Case Service
      const caseData = await this.caseService.getCase(payload.case);

      // Chat with AI
      const aiResponse = await this.chatService.chatGPT(
        payload.message,
        payload.senderType as SenderType,
        caseData?.context,
      );

      // Get The AI responsible for the case
      const aiModel =
        await this.artificialIntelligenceService.getArtificialIntelligenceByModel(
          ArtificialIntelligenceModel.llama3dot1,
        );

      const aiNewMessage = await this.chatService.saveMessage({
        message: aiResponse?.message as string,
        senderType: SenderType.artificialIntelligence,
        sender: aiModel?._id as string,
        case: payload.case,
      });

      // Update the context in Case Service
      const updatedCase = await this.caseService.updateContext(
        payload.case,
        aiResponse?.context,
      );

      // Emit the Updated case to the frontend
      this.caseGateway.server.to(payload.case).emit('case-detail', updatedCase);

      // Send the AI's message to everyone in the room
      this.server.to(payload.case).emit('message', aiNewMessage);
    } catch (error) {
      this.server.to(payload.case).emit('error', error.message);
    }
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(client: any, payload: any): void {
    try {
      client.leave(payload?.caseId);
    } catch (error) {
      this.server.to(payload?.caseId).emit('error', error.message);
    }
  }
}
