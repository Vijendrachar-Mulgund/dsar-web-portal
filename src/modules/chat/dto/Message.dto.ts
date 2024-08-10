import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SenderType } from 'src/enums/SenderType.enum';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(SenderType, { each: true })
  senderType: string;

  @IsString()
  @IsOptional()
  user: string;

  @IsString()
  @IsOptional()
  drone: string;

  @IsString()
  @IsOptional()
  artificialIntelligence: string;

  @IsString()
  @IsNotEmpty()
  case: string;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}
