import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User } from '../../schemas/User.schema';
import { UserInfoDto } from './dto/UserInfo.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createNewUser(createNewUser: UserInfoDto): Promise<User> {
    const saltRounds = +process.env.PASSWORD_SALT_ROUNDS;
    const defaultPassword = process.env.PASSWORD_DEFAULT;

    const encryptedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    const newUserModel = new this.userModel({
      email: createNewUser.email,
      password: encryptedPassword,
      firstname: createNewUser.firstname,
      lastname: createNewUser.lastname,
      role: createNewUser.role,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
    });

    return await newUserModel.save();
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async findUserByIdAndUpdate(
    id: string,
    userinfo: UserInfoDto,
  ): Promise<User> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...userinfo,
        },
        { new: true },
      )
      .lean();
  }
}
