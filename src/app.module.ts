import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServerModule } from './modules/server/server.module';
import { databaseConnectionUrl } from './utils/config/mongodb';
import { ChatGateway } from './modules/chat/chat.gateway';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.production'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(databaseConnectionUrl()),
    UsersModule,
    AuthModule,
    ServerModule,
    ChatModule,
  ],
  controllers: [],
  providers: [ChatGateway],
})
export class AppModule {}
