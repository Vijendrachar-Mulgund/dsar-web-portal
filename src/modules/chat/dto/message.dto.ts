import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { SenderType } from '@app/enums/sender-type.enum';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsEnum(SenderType, { each: true })
  senderType: string;

  @IsString()
  @IsOptional()
  sender: string;

  @IsString()
  @IsNotEmpty()
  case: string;
}
