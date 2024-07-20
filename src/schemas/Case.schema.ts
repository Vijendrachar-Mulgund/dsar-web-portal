import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Case {
  @Prop()
  title: String;

  @Prop()
  description: string;

  @Prop()
  status: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Array, default: [{}] })
  conversation: Array<Object>;
}

export const CaseSchema = SchemaFactory.createForClass(Case);

export type CaseDocument = Case & Document;
