import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import mongoose, { Model } from 'mongoose';
import ollama from 'ollama';

import { Message, MessageDocument } from '@app/schemas/message.schema';
import { MessageDto } from '@app/modules/chat/dto/message.dto';
import { SenderType } from '@app/enums/sender-type.enum';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async saveMessage(messageContent: MessageDto): Promise<MessageDocument> {
    const newMessage = new this.messageModel({
      message: messageContent.message,
      senderType: messageContent.senderType,
      sender: messageContent.sender,
      case: messageContent.case,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const savedNewMessage: MessageDocument = await newMessage.save();

    const populatedMessage = await this.populateMessageSender(
      savedNewMessage?._id as string,
    );

    return populatedMessage[0];
  }

  async populateMessageSender(messageId: string): Promise<any> {
    return await this.messageModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(messageId),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'sender',
          foreignField: '_id',
          as: 'user',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: { $concat: ['$firstname', ' ', '$lastname'] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'drones',
          localField: 'sender',
          foreignField: '_id',
          as: 'drone',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'artificialintelligences',
          localField: 'sender',
          foreignField: '_id',
          as: 'ai',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
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
          pipeline: [
            {
              $project: {
                _id: 1,
                name: { $concat: ['$firstname', ' ', '$lastname'] },
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'drones',
          localField: 'sender',
          foreignField: '_id',
          as: 'drone',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'artificialintelligences',
          localField: 'sender',
          foreignField: '_id',
          as: 'ai',
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
              },
            },
          ],
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
        $sort: {
          createdAt: 1,
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

  async visionGPT(
    imageURL: string,
    message: string,
    senderType: SenderType,
  ): Promise<any> {
    const visionResponse = await ollama.chat({
      model: 'llava',
      messages: [{ role: senderType, content: message, images: [imageURL] }],
    });

    return visionResponse;
  }

  async chatGPT(message: string, senderType: SenderType): Promise<any> {
    const aiContext = [];

    const prompt = { role: senderType.toString(), content: message };
    aiContext.push(prompt);

    const aiResponse = await ollama.chat({
      model: 'llama3',
      messages: [{ role: senderType.toString(), content: message }],
    });

    aiContext.push(aiResponse?.message);

    return aiResponse?.message?.content;
  }
}
