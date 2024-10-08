import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Drone {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  model: string;

  @Prop({ type: String, required: true, unique: true })
  serialNumber: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export const DroneSchema = SchemaFactory.createForClass(Drone);

export type DroneDocument = Drone & Document;
