import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { CaseService } from './case.service';

@Controller('chat')
export class CaseController {
  constructor(private caseService: CaseService) {}

  @Post('create-new-case')
  async createNewCase(@Body() data: any) {
    return await this.caseService.createNewCase(data);
  }
}
