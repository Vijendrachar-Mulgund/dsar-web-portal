import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import * as bcrypt from 'bcrypt';

import { User, UserDocument } from '../../schemas/User.schema';
import { CreateNewUserDto } from './dto/CreateNewUser.dto';
import { ChangePasswordDto } from './dto/ChangePassword.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createNewUser(createNewUser: CreateNewUserDto): Promise<UserDocument> {
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

  async getAllUsers(): Promise<UserDocument[]> {
    return this.userModel.aggregate([{ $unset: ['password'] }]).exec();
  }

  async findUserByEmail(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email: email }).lean();
  }

  async findUserById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).lean();
  }

  async findUserByIdAndUpdatePassword(
    id: string,
    changePasswordData: ChangePasswordDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(
        id,
        {
          ...changePasswordData,
        },
        { new: true },
      )
      .lean();
  }
}
