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
import { ArtificialIntelligenceService } from './artificial-intelligence.service';
import { Request, Response } from 'express';
import { ArtificialIntelligenceDto } from './dto/ArtificialIntelligence.dto';
import { ArtificialIntelligenceResponseDto } from './dto/ArtificialIntelligenceResponse.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/Role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';

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
      const body: ArtificialIntelligenceDto = request.body;
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
