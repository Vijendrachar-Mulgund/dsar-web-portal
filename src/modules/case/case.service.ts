import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import ollama from 'ollama';

import { Case } from '@app/schemas/case.schema';
import { CaseStatus } from '@app/enums/case-status.enum';
import { CaseDto } from '@app/modules/case/dto/case.dto';

@Injectable()
export class CaseService {
  constructor(@InjectModel(Case.name) private caseModel: Model<Case>) {}

  async createNewCase(data: CaseDto): Promise<any> {
    const newCase = new this.caseModel({
      title: data?.title,
      description: data?.description,
      videoURL: data?.videoURL,
      liveVideoURL: data?.liveVideoURL,
      location: data?.location,
      status: CaseStatus.open,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await newCase.save();

    return newCase;
  }

  async updateCase(caseId: String, data: CaseDto): Promise<any> {
    const updateData = { ...data, updatedAt: new Date().toISOString() };

    const updatedCase = await this.caseModel.findByIdAndUpdate(
      caseId,
      updateData,
      {
        new: true,
        lean: true,
      },
    );

    return updatedCase;
  }

  async getAllCases(): Promise<any> {
    return await this.caseModel.find().lean();
  }

  async chatGPT(roomID: string, message: string): Promise<any> {
    const aiResponse = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: message }],
    });

    const response = aiResponse.message.content;

    return response;
  }
}
