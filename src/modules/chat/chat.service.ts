import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from 'src/schemas/Message.schema';
import { MessageDto } from './dto/Message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async sendMessage(messageContent: MessageDto): Promise<MessageDocument> {
    const newMessage = new this.messageModel({
      message: messageContent.message,
      senderType: messageContent.senderType,
      user: messageContent.user,
      drone: messageContent.drone,
      artificialIntelligence: messageContent.artificialIntelligence,
      case: messageContent.case,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return await newMessage.save();
  }

  async getAllMessages(caseId: string): Promise<MessageDocument[]> {
    return await this.messageModel
      .find({ case: caseId })
      .populate(['user'])
      .lean()
      .exec();
  }
}
