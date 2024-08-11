import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  ArtificialIntelligence,
  ArtificialIntelligenceDocument,
} from 'src/schemas/artificial-intelligence.schema';
import { ArtificialIntelligenceDto } from './dto/ArtificialIntelligence.dto';
import { Model } from 'mongoose';

@Injectable()
export class ArtificialIntelligenceService {
  constructor(
    @InjectModel(ArtificialIntelligence.name)
    private artificialIntelligenceModel: Model<ArtificialIntelligenceDocument>,
  ) {}

  async registerNewArtificialIntelligenceModel(
    body: ArtificialIntelligenceDto,
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
}
