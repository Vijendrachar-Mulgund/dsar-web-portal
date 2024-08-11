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

import { DronesService } from '@app/modules/drones/drones.service';
import { Roles } from '@app/decorators/roles.decorator';
import { AuthGuard } from '@app/guards/auth.guard';
import { RolesGuard } from '@app/guards/roles.guard';
import { Role } from '@app/enums/roles.enum';
import { DroneDto } from '@app/modules/drones/dto/drone.dto';
import { DroneResponseDto } from '@app/modules/drones/dto/drone-response.dto';

@Controller('drones')
export class DronesController {
  constructor(private droneService: DronesService) {}

  @Post('register')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async registerNewDrone(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<DroneResponseDto, Record<string, any>>> {
    try {
      const body: DroneDto = request.body;
      const drone = await this.droneService.createNewDroneRecord(body);

      if (!drone) {
        throw new Error('The drone could not be created!');
      }

      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'The New drone is created',
        drone: drone,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Get('available-drones')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getAvailableDrones(
    @Res() response: Response,
  ): Promise<Response<DroneResponseDto, Record<string, any>>> {
    try {
      const drones = await this.droneService.getAllAvailableDrones();

      if (!drones) {
        throw new Error('The drones could not be fetched!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'The available drones are fetched',
        drones: drones,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }
}
