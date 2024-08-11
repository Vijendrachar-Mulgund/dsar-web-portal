import { IsNotEmpty, IsString } from 'class-validator';

export class ArtificialIntelligenceRegisterRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  parameters: string;

  @IsString()
  @IsNotEmpty()
  version: string;
}
