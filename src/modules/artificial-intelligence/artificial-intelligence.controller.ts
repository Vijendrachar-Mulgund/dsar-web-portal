import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ArtificialIntelligenceService } from '@app/modules/artificial-intelligence/artificial-intelligence.service';
import { ArtificialIntelligenceRegisterRequestDto } from '@app/modules/artificial-intelligence/dto/artificial-intelligence-register-request.dto';
import { ArtificialIntelligenceResponseDto } from '@app/modules/artificial-intelligence/dto/artificial-intelligence-Response.dto';
import { Roles } from '@app/decorators/roles.decorator';
import { Role } from '@app/enums/roles.enum';
import { RolesGuard } from '@app/guards/roles.guard';
import { AuthGuard } from '@app/guards/auth.guard';

@Controller('artificial-intelligence')
export class ArtificialIntelligenceController {
  constructor(
    private readonly artificialIntelligenceService: ArtificialIntelligenceService,
  ) {}

  @Post('register')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async registerNewArtificialIntelligenceModel(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<ArtificialIntelligenceResponseDto, Record<string, any>>> {
    try {
      const body: ArtificialIntelligenceRegisterRequestDto = request.body;
      const newAiModel =
        await this.artificialIntelligenceService.registerNewArtificialIntelligenceModel(
          body,
        );

      if (!newAiModel) {
        throw new Error('The AI model could not be registered');
      }

      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'AI model registered successfully',
        drone: newAiModel,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong, Please try again later',
      );
    }
  }

  @Get('all-ai-models')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllArtificialIntelligenceModels(
    @Res() response: Response,
  ): Promise<Response<ArtificialIntelligenceResponseDto, Record<string, any>>> {
    try {
      const aiModels =
        await this.artificialIntelligenceService.getAllArtificialIntelligenceModels();

      if (!aiModels) {
        throw new Error('The AI models could not be fetched');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'AI models fetched successfully',
        drone: aiModels,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong, Please try again later',
      );
    }
  }
}
