import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { SenderType } from 'src/enums/SenderType.enum';
import { User } from './User.schema';
import { Drone } from './Drone.schema';
import { ArtificialIntelligence } from './ArtificialIntelligence.schema';
import { Case } from './Case.schema';

@Schema()
export class Message {
  @Prop({ type: String, required: true })
  message: string;

  @Prop({ type: String, enum: SenderType, required: true })
  senderType: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    refPath: 'senderType',
    required: true,
  })
  sender: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: Case.name, required: true })
  case: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now() })
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageDocument = Message & Document;
