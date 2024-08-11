import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { ServerModule } from './modules/server/server.module';
import { databaseConnectionUrl } from './utils/config/mongodb';
import { CaseModule } from './modules/case/case.module';
import { ChatModule } from './modules/chat/chat.module';
import { DronesModule } from './modules/drones/drones.module';
import { ArtificialIntelligenceModule } from './modules/artificial-intelligence/artificial-intelligence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.production'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      databaseConnectionUrl(
        process.env.DATABASE_CONNECTION_URL,
        process.env.DATABASE_NAME,
        process.env.DATABASE_USERNAME,
        process.env.DATABASE_PASSWORD,
      ),
    ),
    UsersModule,
    AuthModule,
    ServerModule,
    CaseModule,
    ChatModule,
    DronesModule,
    ArtificialIntelligenceModule,
  ],
})
export class AppModule {}
