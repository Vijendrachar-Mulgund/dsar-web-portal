import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class ArtificialIntelligence {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  model: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  parameters: string;

  @Prop({ type: String, required: true })
  version: string;

  @Prop({ type: Date, required: true })
  createdAt: Date;

  @Prop({ type: Date, required: true })
  updatedAt: Date;
}

export const ArtificialIntelligenceSchema = SchemaFactory.createForClass(
  ArtificialIntelligence,
);

export type ArtificialIntelligenceDocument = ArtificialIntelligence & Document;
