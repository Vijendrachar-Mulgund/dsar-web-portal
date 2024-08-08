import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

import { Case } from '../../../schemas/Case.schema';

export class CaseResponseDto {
  @IsNumber()
  @IsNotEmpty()
  statusCode: number;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsObject()
  @IsNotEmptyObject()
  case: Case;
}
