import {
  Controller,
  Post,
  Get,
  BadRequestException,
  Req,
  Res,
  HttpStatus,
  Put,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { CaseService } from '@app/modules/case/case.service';
import { CaseDto } from '@app/modules/case/dto/case.dto';
import { CaseResponseDto } from '@app/modules/case/dto/case-response.dto';
import { AllCaseResponseDto } from '@app/modules/case/dto/all-case-response.dto';
import { CaseGateway } from '@app/modules/case/case.gateway';
import { ChatService } from '@app/modules/chat/chat.service';
import { SenderType } from '@app/enums/sender-type.enum';
import { ChatGateway } from '@app/modules/chat/chat.gateway';
import { ArtificialIntelligenceService } from '@app/modules/artificial-intelligence/artificial-intelligence.service';
import { ArtificialIntelligenceModel } from '@app/enums/artificial-intelligence-models.enum';

@Controller('case')
export class CaseController {
  constructor(
    private caseService: CaseService,
    private caseGateway: CaseGateway,
    private chatService: ChatService,
    private chatGateway: ChatGateway,
    private artificialIntelligenceService: ArtificialIntelligenceService,
  ) {}

  @Post('create-new-case')
  async createNewCase(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<CaseResponseDto, Record<string, any>>> {
    try {
      const body: CaseDto = request.body;
      const newCase = await this.caseService.createNewCase(body);

      if (!newCase) {
        throw new Error('The case could not be created!');
      }

      this.caseGateway.getAllCases();

      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'The New case is created',
        case: newCase,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Put('initiate-ai-checklist/:caseId')
  async initiateAiAssistance(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<CaseResponseDto, Record<string, any>>> {
    try {
      const caseId: string = request.params.caseId;
      const body: CaseDto = request.body;

      // Call the weather API to get the weather details
      const weatherDetails = await this.caseService.getWeatherDetails(body);

      if (!weatherDetails) {
        throw new Error('The weather details could not be fetched!');
      }

      const updatedBody = { ...body, weather: weatherDetails };

      // Update the case with the AI assistance initiated
      const updatedCase = await this.caseService.updateCase(
        caseId,
        updatedBody,
      );

      if (!updatedCase) {
        throw new Error('The case could not be updated!');
      }

      const caseDetailResponse = {
        statusCode: HttpStatus.OK,
        message: 'The case has been initiated',
        data: updatedCase,
      };

      // Emit an event to the case room
      this.caseGateway.server
        .to(caseId)
        .emit('case-detail', caseDetailResponse);

      const visionPrompt = `Describe the terrain in this image for a rescue operation, give a detailed description of the scene. Note any potential hazards, and identify any vehicles or landmarks in the image.`;

      // Call the Vision API to get the image details
      const visionResponse = await this.chatService.visionGPT(
        body?.imageURL,
        visionPrompt,
        SenderType?.drone,
      );

      const checklistPrompt = `Write a description for the first responders in a search and rescue operation. The description should be detailed and give all the necessary information to the team heading out to rescue. The drone has located ${body?.numberOfPeopleFound} persons that were reported missing. \n\nDescription of the scene where they were found: ${visionResponse}. \n\nWeather conditions at the location where they were found: Temperature - ${weatherDetails?.main?.temp} degrees Celsius, Visibility - ${weatherDetails?.visibility} meters, Wind - ${weatherDetails?.wind?.speed} m/s, Humidity - ${weatherDetails?.main?.humidity}%. \n\nWith the above information, generate a detailed description for the first responders, and generate checklist of medical supplies and any other items required according to the weather, to be bought to the scene.`;

      const savedPrompt = await this.chatService.saveMessage({
        message: checklistPrompt,
        senderType: SenderType.drone,
        sender: body?.droneId,
        case: caseId,
      });

      // Send a message to the chat room
      this.chatGateway.server.to(caseId).emit('message', savedPrompt);

      // Call the ChatGPT API to get the chat details
      const chatResponse = await this.chatService.chatGPT(
        checklistPrompt,
        SenderType?.user,
        [],
      );

      const aiModel =
        await this.artificialIntelligenceService.getArtificialIntelligenceByModel(
          ArtificialIntelligenceModel.llama3dot1,
        );

      // Save the chat response
      const savedChatResponse = await this.chatService.saveMessage({
        message: chatResponse?.message,
        senderType: SenderType.artificialIntelligence,
        sender: aiModel?._id as string,
        case: caseId,
      });

      this.chatGateway.server.to(caseId).emit('message', savedChatResponse);

      await this.caseService.updateContext(caseId, chatResponse?.context);

      const initiatedCaseDetail = {
        statusCode: HttpStatus.OK,
        message: 'The case has been initiated',
      };

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'The case has been initiated',
        data: initiatedCaseDetail,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Put('update-case/:caseId')
  async updateCase(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<CaseResponseDto, Record<string, any>>> {
    try {
      const body: CaseDto = request.body;
      const caseId: string = request.params.caseId;
      const updatedCase = await this.caseService.updateCase(caseId, body);

      if (!updatedCase) {
        throw new Error('The case could not be updated!');
      }

      const updatedCaseDetail = {
        statusCode: HttpStatus.OK,
        message: 'The case has been updated',
        data: updatedCase,
      };

      this.caseGateway.server.to(caseId).emit('case-detail', updatedCaseDetail);

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'The case has been updated',
        case: updatedCase,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Get('get-all-cases')
  async getAllCases(
    @Res() response: Response,
  ): Promise<Response<AllCaseResponseDto, Record<string, any>>> {
    try {
      const cases = await this.caseService.getAllCases();

      if (!cases) {
        throw new Error('No cases found!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'All cases retrieved',
        case: cases,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }
}
