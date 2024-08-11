import { Module } from '@nestjs/common';

import { AuthController } from '@app/modules/auth/auth.controller';
import { UsersModule } from '@app/modules/users/users.module';
import { AuthService } from '@app/modules/auth/auth.service';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
