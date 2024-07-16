import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

import { User } from 'src/schemas/User.schema';

export class CreateNewUserResponseDto {
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsNotEmptyObject()
  user: User;
}
