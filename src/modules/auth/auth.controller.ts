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

import { AuthResponse } from './dto/AuthResponse.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

      const { password, ...result } = user;

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
  async authenticate(
    @Session() session: Record<string, any>,
    @Res() response: Response,
  ): Promise<Response<AuthResponse, Record<string, any>>> {
    try {
      if (!session.userID) {
        throw new Error('You are not logged in!');
      }

      const user = await this.authService.authenticateUser(session.userID);

      if (!user) {
        throw new Error('User not found!');
      }

      const { password, ...result } = user;

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

  @Post('sign-out')
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
