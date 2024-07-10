import { Get, Injectable } from '@nestjs/common';
import Ollama from 'ollama';

@Injectable()
export class AppService {
  async getHello(): Promise<any> {
    const response = await Ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: 'Describe YOLOv8 Model' }],
    });

    console.log('Response -> ', response);

    return response.message.content;
  }
}
