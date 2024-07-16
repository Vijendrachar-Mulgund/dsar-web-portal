import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User } from '../../schemas/User.schema';
import { createNewUserRequestDto } from './dto/CreateNewUserRequest.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createNewUser(createNewUser: createNewUserRequestDto): Promise<User> {
    const saltRounds = +process.env.PASSWORD_SALT_ROUNDS;
    const encryptedPassword = await bcrypt.hash(
      createNewUser.password,
      saltRounds,
    );

    const newUserModel = new this.userModel({
      email: createNewUser.email,
      password: encryptedPassword,
      firstname: createNewUser.firstname,
      lastname: createNewUser.lastname,
      role: createNewUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    return await newUserModel.save();
  }
}
