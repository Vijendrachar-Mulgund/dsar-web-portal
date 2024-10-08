import {
  Controller,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { AuthResponse } from '@app/modules/auth/dto/auth-response.dto';
import { AuthService } from '@app/modules/auth/auth.service';
import { AuthGuard } from '@app/guards/auth.guard';
import { UsersService } from '@app/modules/users/users.service';
import { CreateNewUserDto } from '../users/dto/create-new-user.dto';
import { Role } from '@app/enums/roles.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('sign-in')
  async signIn(
    @Session() session: Record<string, any>,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<AuthResponse, Record<string, any>>> {
    try {
      if (!request.body.email || !request.body.password) {
        throw new Error('Please enter a valid Email and Password!');
      }

      const user = await this.authService.validateUser(request.body);

      if (!user) {
        throw new Error(`The Email or Password is incorrect!`);
      }

      if (!user.isAccountActive) {
        throw new Error(`Your account is not active!`);
      }

      const { password, ...result } = user;

      // Create the User session
      session.userID = user._id;
      session.role = user.role;

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Login successful!',
        user: result,
      });
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Post('authenticate')
  @UseGuards(AuthGuard)
  async authenticate(
    @Session() session: Record<string, any>,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<AuthResponse, Record<string, any>>> {
    try {
      if (!session.userID) {
        throw new Error('You are not logged in!');
      }

      const result = request['user'];

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'You are logged in!',
        user: result,
      });
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Patch('change-password')
  @UseGuards(AuthGuard)
  async changePassword(
    @Session() session: Record<string, any>,
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<AuthResponse, Record<string, any>>> {
    try {
      if (!session.userID) {
        throw new Error('You are not logged in!');
      }

      if (!request.body.password || !request.body.newPassword) {
        throw new Error('Please enter a valid Password!');
      }

      const user = await this.authService.changePassword(
        session.userID,
        request.body.password,
        request.body.newPassword,
      );

      if (!user) {
        throw new Error('Please check your Password and try again!');
      }

      const { password, ...result } = user;

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Password changed successfully!',
        user: result,
      });
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Post('sign-up-admin')
  async signUpAdmin(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<Response<AuthResponse, Record<string, any>>> {
    try {
      if (!request?.body?.key || request?.body?.key !== process.env.ADMIN_KEY) {
        throw new Error(
          "The Admin code doesn't match! Please enter a valid code",
        );
      }

      const createUserPayload: CreateNewUserDto = {
        email: request?.body?.email,
        firstname: request?.body?.firstname,
        lastname: request?.body?.lastname,
        role: Role.admin,
      };

      const user = await this.usersService.createNewUser(createUserPayload);

      if (!user) {
        throw new Error('Unable to create new account!');
      }

      return response.status(HttpStatus.CREATED).json({
        statusCode: HttpStatus.CREATED,
        message: 'Admin created successfully!',
        data: user?.email,
      });
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }

  @Post('sign-out')
  @UseGuards(AuthGuard)
  async signOut(
    @Session() session: Record<string, any>,
    @Res() response: Response,
  ): Promise<Response<AuthResponse, Record<string, any>>> {
    try {
      if (!session.userID) {
        throw new Error('You are not logged in!');
      }

      session.destroy((error) => {
        if (error) {
          throw new Error('Something went wrong!');
        }
      });

      return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Sign out successful!',
      });
    } catch (error: any) {
      throw new UnauthorizedException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
  }
}
