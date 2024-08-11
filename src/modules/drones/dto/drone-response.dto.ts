import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

import { Drone } from '@app/schemas/drone.schema';

export class DroneResponseDto {
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsNotEmptyObject()
  drone: Drone;
}
