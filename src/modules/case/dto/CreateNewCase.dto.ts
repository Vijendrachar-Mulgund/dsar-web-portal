import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateNewCaseDto {
  @IsEmail()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  videoURL?: string;

  @IsString()
  @IsOptional()
  liveVideoURL?: string;

  @IsString()
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number];
  };
}
