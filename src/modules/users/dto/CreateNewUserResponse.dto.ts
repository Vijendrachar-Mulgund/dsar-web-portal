import { User } from 'src/schemas/User.schema';

export class CreateNewUserResponseDto {
  statusCode: number;
  message: string;
  user: User;
}
