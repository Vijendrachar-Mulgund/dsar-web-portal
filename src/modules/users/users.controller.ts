import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { UsersService } from '@app/modules/users/users.service';
import { UserResponseDto } from '@app/modules/users/dto/user-response.dto';
import { Role } from '@app/enums/roles.enum';
import { Roles } from '@app/decorators/roles.decorator';
import { RolesGuard } from '@app/guards/roles.guard';
import { AuthGuard } from '@app/guards/auth.guard';

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
    try {
      const user = await this.usersService.createNewUser(request.body);

      if (!user) {
        throw new Error('The user could not be created!');
      }

      const result = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        isAccountActive: user.isAccountActive,
      };

      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'The New user is created',
        user: result,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Get('all-users')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async getAllUsers(
    @Res() response: Response,
  ): Promise<Response<UserResponseDto[], Record<string, any>>> {
    try {
      const users = await this.usersService.getAllUsers();

      if (!users) {
        throw new Error('No users found!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'All users',
        users,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Patch('toggle-account-status')
  @Roles(Role.admin)
  @UseGuards(AuthGuard, RolesGuard)
  async deactivateAccount(@Req() request: Request, @Res() response: Response) {
    try {
      const user =
        await this.usersService.findUserByEmailAndToggleAccountStatus(
          request.body.email,
          request.body.id,
          request.body.currentStatus,
        );

      if (!user) {
        throw new Error('The user account could not be deactivated!');
      }

      const result = {
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        role: user.role,
        isAccountActive: user.isAccountActive,
      };

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'The user account is deactivated',
        user: result,
      });
    } catch (error) {
      throw new BadRequestException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }
}
