import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UsersService } from './users.service';
import { CreateNewUserResponseDto } from './dto/CreateNewUserResponse.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('create-new')
  async createNewUser(
    @Session() session: Record<string, any>,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<CreateNewUserResponseDto, Record<string, any>>> {
    const user = await this.usersService.createNewUser(request.body);

    session.user = user;

    return response.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'The New user is created',
      user,
    });
  }
}
