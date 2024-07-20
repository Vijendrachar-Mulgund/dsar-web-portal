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

  async processMessage(message: string): Promise<any> {
    const aiResponse = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: message }],
    });

    const response = aiResponse.message.content;

    return response;
  }
}
