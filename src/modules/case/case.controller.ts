import {
  Controller,
  Post,
  Get,
  Body,
  BadRequestException,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CaseService } from './case.service';
import { CreateNewCaseDto } from './dto/CreateNewCase.dto';
import { CaseResponseDto } from './dto/CaseResponse.dto';
import { stat } from 'fs';
import { AllCaseResponseDto } from './dto/AllCaseResponse.dto';

@Controller('case')
export class CaseController {
  constructor(private caseService: CaseService) {}

  @Post('create-new-case')
  async createNewCase(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<CaseResponseDto, Record<string, any>>> {
    try {
      const body: CreateNewCaseDto = request.body;
      const newCase = await this.caseService.createNewCase(body);

      if (!newCase) {
        throw new Error('The case could not be created!');
      }

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
