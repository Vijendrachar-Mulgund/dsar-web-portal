import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session || !session.userID) {
      throw new UnauthorizedException('You are not logged in!');
    }

    try {
      const user = await this.usersService.findUserById(session?.userID);

      if (!user) {
        request.session.destroy((error) => {
          throw new Error(error.message);
        });
        throw new Error("User doesn't exist!");
      }

      if (!user.isAccountActive) {
        request.session.destroy((error) => {
          throw new Error(error.message);
        });
        throw new Error('User account is not active!');
      }

      const { password, ...result } = user;

      // Make the User object available in the request object
      request['user'] = result;
    } catch (error) {
      throw new UnauthorizedException(
        error.message || 'Something went wrong. Please try again later!',
      );
    }
    return true;
  }
}
