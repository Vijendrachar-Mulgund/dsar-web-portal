import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import ollama from 'ollama';

import { Case } from '../../schemas/Case.schema';

@Injectable()
export class CaseService {
  constructor(@InjectModel(Case.name) private caseModel: Model<Case>) {}

  async createNewCase(data: any): Promise<any> {
    const newCase = new this.caseModel(data);

    await newCase.save();

    return newCase;
  }

  async chatGPT(roomID: string, message: string): Promise<any> {
    console.log('roomID', roomID);
    const conversation = await this.caseModel.findById(roomID);

    const conversationArray = conversation.conversation;

    console.log('Test', conversation);

    const aiResponse = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: message }],
    });

    const response = aiResponse.message.content;

    conversationArray.push({
      role: 'AI',
      content: response,
    });

    await this.caseModel.findByIdAndUpdate(roomID, {
      conversation: conversationArray,
    });

    return response;
  }
}