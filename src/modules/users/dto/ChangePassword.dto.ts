import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  isDefaultPassword: boolean;

  @IsString()
  @IsNotEmpty()
  updatedAt: string;
}
