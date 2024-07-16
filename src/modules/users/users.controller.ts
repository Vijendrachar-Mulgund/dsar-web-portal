import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UsersService } from './users.service';
import { UserResponseDto } from './dto/UserResponse.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  async registerNewUser(
    @Session() session: Record<string, any>,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<UserResponseDto, Record<string, any>>> {
    const user = await this.usersService.createNewUser(request.body);

    session.user = user;

    return response.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'The New user is created',
      user,
    });
  }
}
