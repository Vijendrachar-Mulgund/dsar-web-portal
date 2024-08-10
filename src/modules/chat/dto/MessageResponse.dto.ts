import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Message } from 'src/schemas/Message.schema';

import { User } from 'src/schemas/User.schema';

export class MessageResponseDto {
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsNotEmptyObject()
  messageData: Message;
}
