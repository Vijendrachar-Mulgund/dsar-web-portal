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

@Controller('case')
export class CaseController {
  constructor(
    private caseService: CaseService,
    private caseGateway: CaseGateway,
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
