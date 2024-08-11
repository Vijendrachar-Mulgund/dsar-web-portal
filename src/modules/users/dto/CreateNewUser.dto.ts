import {
  IsString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';
import { Role } from '@app/enums/roles.enum';

export class CreateNewUserDto {
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

  @IsEnum(Role, { each: true })
  @IsNotEmpty()
  @IsOptional()
  role: string;
}
