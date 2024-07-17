import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthSignInRequestDto } from './dto/AuthSignInRequest.dto';
import { UsersService } from '../users/users.service';
import { User } from '../../schemas/User.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(requestBody: AuthSignInRequestDto): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(requestBody.email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      requestBody.password,
      user.password,
    );

    if (!isPasswordValid) return null;

    return user;
  }
}
