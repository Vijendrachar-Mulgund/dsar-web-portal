import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  ArtificialIntelligence,
  ArtificialIntelligenceDocument,
} from '@app/schemas/artificial-intelligence.schema';
import { ArtificialIntelligenceRegisterRequestDto } from '@app/modules/artificial-intelligence/dto/artificial-intelligence-register-request.dto';
import { ArtificialIntelligenceModel } from '@app/enums/artificial-intelligence-models.enum';

@Injectable()
export class ArtificialIntelligenceService {
  constructor(
    @InjectModel(ArtificialIntelligence.name)
    private artificialIntelligenceModel: Model<ArtificialIntelligenceDocument>,
  ) {}

  async registerNewArtificialIntelligenceModel(
    body: ArtificialIntelligenceRegisterRequestDto,
  ): Promise<ArtificialIntelligenceDocument> {
    const newAiModel = new this.artificialIntelligenceModel({
      name: body?.name,
      model: body?.model,
      description: body?.description,
      parameters: body?.parameters,
      version: body?.version,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return await newAiModel.save();
  }

  async getAllArtificialIntelligenceModels(): Promise<
    ArtificialIntelligenceDocument[]
  > {
    return this.artificialIntelligenceModel.find().exec();
  }

  async getArtificialIntelligenceByModel(
    model: ArtificialIntelligenceModel,
  ): Promise<ArtificialIntelligenceDocument> {
    return this.artificialIntelligenceModel.findOne({ model }).exec();
  }
}
