import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class CaseDto {
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

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number];
  };
}
