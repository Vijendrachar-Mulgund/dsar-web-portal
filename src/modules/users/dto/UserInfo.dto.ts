import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Roles } from '../../../enums/Roles.enum';

export class UserInfoDto {
  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastname: string;

  @IsEnum(Roles, { each: true })
  @IsNotEmpty()
  @IsOptional()
  role: string;
}
