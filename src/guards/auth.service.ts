import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const session = request.session;

    if (!session) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.usersService.findUserById(session?.userID);

      if (!user) {
        throw new UnauthorizedException();
      }

      const { password, ...result } = user;

      request.user = result;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
