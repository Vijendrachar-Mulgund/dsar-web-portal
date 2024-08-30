import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '@app/modules/users/users.module';
import { AuthModule } from '@app/modules/auth/auth.module';
import { ServerModule } from '@app/modules/server/server.module';
import { databaseConnectionUrl } from '@app/utils/config/mongodb';
import { CaseModule } from '@app/modules/case/case.module';
import { ChatModule } from '@app/modules/chat/chat.module';
import { DronesModule } from '@app/modules/drones/drones.module';
import { ArtificialIntelligenceModule } from '@app/modules/artificial-intelligence/artificial-intelligence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.production.local'],
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
