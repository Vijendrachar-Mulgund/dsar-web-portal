import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DronesService } from '@app/modules/drones/drones.service';
import { DronesController } from '@app/modules/drones/drones.controller';
import { Drone, DroneSchema } from '@app/schemas/drone.schema';
import { UsersModule } from '@app/modules/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drone.name, schema: DroneSchema }]),
    UsersModule,
  ],
  providers: [DronesService],
  controllers: [DronesController],
})
export class DronesModule {}
