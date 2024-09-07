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
      const message = await this.chatService.saveMessage(body);

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

  @Post('ollama-vision')
  async ollamaVision(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<MessageResponseDto, Record<string, any>>> {
    try {
      const { imageURL, message, senderType }: any = request.body;
      const visionResponse = await this.chatService.visionGPT(
        imageURL,
        message,
        senderType,
      );

      if (!visionResponse) {
        throw new Error(
          'Unable to process the request. Please try again later!',
        );
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Request processed successfully!',
        messageData: visionResponse,
      });
    } catch (error) {
      throw new BadRequestException(
        error?.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Post('ollama-chat')
  async ollamaChat(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<MessageResponseDto, Record<string, any>>> {
    try {
      const {
        senderType,
        numberOfPeopleFound,
        visionResponse,
        weatherDetails,
      }: any = request.body;

      console.log('weatherDetails', weatherDetails);

      const checklistPrompt = `Write a description for the first responders in a search and rescue operation. The description should be detailed and give all the necessary information to the team heading out to rescue. The drone has located ${numberOfPeopleFound} persons that were reported missing. \n\nDescription of the scene where they were found: ${visionResponse}. \n\nWeather conditions at the location where they were found: Temperature - ${weatherDetails?.main?.temp} degrees Celsius, Visibility - ${weatherDetails?.visibility} meters, Wind - ${weatherDetails?.wind?.speed} m/s, Humidity - ${weatherDetails?.main?.humidity}%. \n\nWith the above information, generate a detailed description for the first responders, and generate checklist of medical supplies and any other items required according to the weather, to be bought to the scene.`;

      console.log('checklistPrompt', checklistPrompt);

      const chatResponse = await this.chatService.chatGPT(
        checklistPrompt,
        senderType,
        null,
      );

      if (!chatResponse) {
        throw new Error(
          'Unable to process the request. Please try again later!',
        );
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Request processed successfully!',
        messageData: chatResponse,
      });
    } catch (error) {
      console.log('error', error);
      throw new BadRequestException(
        error?.message || 'Something went wrong. Please try again later!',
      );
    }
  }
}
