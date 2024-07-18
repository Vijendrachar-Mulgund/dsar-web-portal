import {
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UsersService } from './users.service';
import { UserResponseDto } from './dto/UserResponse.dto';
import { Role } from '../../enums/Role.enum';
import { Roles } from '../../decorators/roles.decorator';
import { RolesGuard } from '../../guards/roles.guard';
import { AuthGuard } from '../../guards/auth.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('register')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async registerNewUser(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<UserResponseDto, Record<string, any>>> {
    const user = await this.usersService.createNewUser(request.body);

    return response.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: 'The New user is created',
      user,
    });
  }
}
