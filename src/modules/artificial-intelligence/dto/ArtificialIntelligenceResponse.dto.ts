import { IsNotEmpty, IsString } from 'class-validator';
import { Drone } from 'src/schemas/Drone.schema';

export class ArtificialIntelligenceResponseDto {
  @IsString()
  @IsNotEmpty()
  statusCode: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  drone: Drone;
}
