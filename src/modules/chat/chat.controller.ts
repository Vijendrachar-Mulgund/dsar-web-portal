import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ChatService } from '@app/modules/chat/chat.service';
import { MessageDto } from '@app/modules/chat/dto/message.dto';
import { MessageResponseDto } from '@app/modules/chat/dto/message-response.dto';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('send-message')
  async sendMessage(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<MessageResponseDto, Record<string, any>>> {
    try {
      const body: MessageDto = request.body;
      const message = await this.chatService.sendMessage(body);

      if (!message) {
        throw new Error('Unable to send message. Please try again later!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Message sent successfully!',
        messageData: message,
      });
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Get('get-all-messages/:caseId')
  async getAllMessages(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<MessageResponseDto, Record<string, any>>> {
    try {
      const caseId: string = request.params.caseId as string;
      const messages = await this.chatService.getAllMessages(caseId);

      if (!messages) {
        throw new Error('Unable to fetch messages. Please try again later!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Messages fetched successfully!',
        messageData: messages,
      });
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Something went wrong. Please try again later!',
      );
    }
  }
}
