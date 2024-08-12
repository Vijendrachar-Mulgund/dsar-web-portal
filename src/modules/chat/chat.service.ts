import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Message, MessageDocument } from '@app/schemas/message.schema';
import { MessageDto } from '@app/modules/chat/dto/message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async sendMessage(messageContent: MessageDto): Promise<MessageDocument> {
    const newMessage = new this.messageModel({
      message: messageContent.message,
      senderType: messageContent.senderType,
      sender: messageContent.sender,
      case: messageContent.case,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return await newMessage.save();
  }

  async getAllMessages(caseId: string): Promise<MessageDocument[]> {
    return await this.messageModel.aggregate([
      {
        $match: {
          case: new mongoose.Types.ObjectId(caseId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'drones',
          localField: 'sender',
          foreignField: '_id',
          as: 'drone',
        },
      },
      {
        $lookup: {
          from: 'artificialintelligences',
          localField: 'sender',
          foreignField: '_id',
          as: 'ai',
        },
      },
      {
        $addFields: {
          sender: {
            $switch: {
              branches: [
                {
                  case: { $eq: ['$senderType', 'User'] },
                  then: { $arrayElemAt: ['$user', 0] },
                },
                {
                  case: { $eq: ['$senderType', 'Drone'] },
                  then: { $arrayElemAt: ['$drone', 0] },
                },
                {
                  case: { $eq: ['$senderType', 'ArtificialIntelligence'] },
                  then: { $arrayElemAt: ['$ai', 0] },
                },
              ],
              default: null,
            },
          },
        },
      },
      {
        $project: {
          user: 0,
          drone: 0,
          ai: 0,
        },
      },
    ]);
  }
}
