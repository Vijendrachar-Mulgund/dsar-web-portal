import { Module } from '@nestjs/common';

import { ServerController } from '@app/modules/server/server.controller';

@Module({
  controllers: [ServerController],
})
export class ServerModule {}
