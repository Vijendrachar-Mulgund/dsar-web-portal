import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Drone, DroneDocument } from '@app/schemas/drone.schema';
import { DroneDto } from '@app/modules/drones/dto/drone.dto';

@Injectable()
export class DronesService {
  constructor(
    @InjectModel(Drone.name) private droneModel: Model<DroneDocument>,
  ) {}

  async createNewDroneRecord(drone: DroneDto): Promise<DroneDocument> {
    const newDroneModel = new this.droneModel({
      name: drone.name,
      model: drone.model,
      serialNumber: drone.serialNumber,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return await newDroneModel.save();
  }

  async getAllAvailableDrones(): Promise<DroneDocument[]> {
    return this.droneModel.find().exec();
  }
}
