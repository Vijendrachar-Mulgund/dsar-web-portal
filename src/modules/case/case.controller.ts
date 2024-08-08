import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { CaseService } from './case.service';
import { CaseStatus } from 'src/enums/CaseStatus.enum';

@Controller('case')
export class CaseController {
  constructor(private caseService: CaseService) {}

  @Post('create-new-case')
  async createNewCase(@Body() data: any) {
    return await this.caseService.createNewCase({
      ...data,
      status: CaseStatus.open,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  @Get('get-all-cases')
  async getAllCases() {
    return await this.caseService.getAllCases();
  }
}
