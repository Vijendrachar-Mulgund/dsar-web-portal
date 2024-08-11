import { IsOptional, IsString } from 'class-validator';

export class DroneDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  model: string;

  @IsString()
  @IsOptional()
  serialNumber: string;
}
