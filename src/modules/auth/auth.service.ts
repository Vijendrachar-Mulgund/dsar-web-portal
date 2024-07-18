import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthSignInRequestDto } from './dto/AuthSignInRequest.dto';
import { UsersService } from '../users/users.service';
import { User, UserDocument } from '../../schemas/User.schema';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(
    requestBody: AuthSignInRequestDto,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findUserByEmail(requestBody.email);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(
      requestBody.password,
      user.password,
    );

    if (!isPasswordValid) return null;

    return user;
  }

  async authenticateUser(id: string): Promise<UserDocument> {
    return this.usersService.findUserById(id);
  }

  async changePassword(
    userID: string,
    password: string,
    newPassword: string,
  ): Promise<UserDocument | null> {
    const user = await this.usersService.findUserById(userID);

    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return null;

    const saltRounds = +process.env.PASSWORD_SALT_ROUNDS;
    const encryptedPassword = await bcrypt.hash(newPassword, saltRounds);

    return this.usersService.findUserByIdAndUpdatePassword(userID, {
      password: encryptedPassword,
      isDefaultPassword: false,
      updatedAt: new Date().toISOString(),
    });
  }
}
