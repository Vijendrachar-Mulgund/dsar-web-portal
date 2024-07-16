import { IsString, IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { Roles } from '../../../enums/Roles.enum';

export class createNewUserRequestDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsEnum(Roles, { each: true })
  @IsNotEmpty()
  role: string;
}
