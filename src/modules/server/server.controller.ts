import {
  Controller,
  Get,
  HttpStatus,
  Res,
  ServiceUnavailableException,
} from '@nestjs/common';

import { Response } from 'express';

import { HealthCheckResponseDto } from './dto/HealthCheckResponse.dto';

@Controller('server')
export class ServerController {
  @Get('health')
  healthCheck(@Res() response: Response): Response<HealthCheckResponseDto> {
    try {
      const now = new Date().toISOString();
      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'The Server is Running 🚀',
        data: {
          currentServerTime: now,
        },
      });
    } catch (error: any) {
      throw new ServiceUnavailableException(
        'There is a problem with the server ☹️',
        {
          cause: error,
          description: error?.message,
        },
      );
    }
  }
}
