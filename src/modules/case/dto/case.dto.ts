import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

import { CaseStatus } from '@app/enums/case-status.enum';

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

  @IsString()
  @IsOptional()
  imageURL?: string;

  @IsString()
  @IsOptional()
  droneId?: string;

  @IsEnum(CaseStatus, { each: true })
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  weather?: Object;

  @IsBoolean()
  @IsOptional()
  isLive?: boolean;

  @IsNumber()
  @IsOptional()
  numberOfPeopleFound?: number;

  @IsString()
  @IsOptional()
  location?: {
    type: string;
    coordinates: [number, number];
  };
}
