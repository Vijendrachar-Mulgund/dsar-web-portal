import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { CaseStatus } from '@app/enums/case-status.enum';

@Schema()
export class Case {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, enum: CaseStatus, required: true })
  status: string;

  @Prop({ type: String })
  videoURL: string;

  @Prop({ type: String })
  liveVideoURL: string;

  @Prop({ type: String })
  imageURL: string;

  @Prop({ type: Boolean, default: false })
  isLive: boolean;

  @Prop({ type: Array, default: [] })
  context: Array<any>;

  // GeoJSON Point - [longitude, latitude]
  @Prop({ type: Object, coordinates: [Number] })
  location: {
    type: { type: string };
    coordinates: [number];
  };

  @Prop({ type: Object })
  weather: Object;

  @Prop({ type: Number })
  numberOfPeopleFound: number;

  @Prop({ type: Date, required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now() })
  updatedAt: Date;
}

export const CaseSchema = SchemaFactory.createForClass(Case);

export type CaseDocument = Case & Document;
