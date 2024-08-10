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
import { DronesService } from './drones.service';
import { Roles } from 'src/decorators/roles.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Role } from 'src/enums/Role.enum';
import { DroneDto } from './dto/Drone.dto';
import { Request, Response } from 'express';
import { DroneResponseDto } from './dto/DroneResponse.dto';

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
