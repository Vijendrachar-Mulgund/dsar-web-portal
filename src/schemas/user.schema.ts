import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

import { Role } from '@app/enums/roles.enum';

@Schema()
export class User {
  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, required: true, minlength: 10 })
  password: string;

  @Prop({ type: Boolean, required: true, default: true })
  isDefaultPassword: boolean;

  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, required: true })
  lastname: string;

  @Prop({ type: Boolean, required: true, default: true })
  isAccountActive: boolean;

  @Prop({ type: String, enum: Role, required: true })
  role: string;

  @Prop({ type: Date, required: true, default: Date.now() })
  createdAt: Date;

  @Prop({ type: Date, required: true, default: Date.now() })
  updatedAt: Date;

  @Prop({ type: Date })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

export type UserDocument = User & Document;
