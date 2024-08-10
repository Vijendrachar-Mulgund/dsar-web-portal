import { Module } from '@nestjs/common';
import { DronesService } from './drones.service';
import { DronesController } from './drones.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Drone, DroneSchema } from 'src/schemas/Drone.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Drone.name, schema: DroneSchema }]),
    UsersModule,
  ],
  providers: [DronesService],
  controllers: [DronesController],
})
export class DronesModule {}
