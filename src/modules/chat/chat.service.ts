import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Case } from 'src/schemas/Case.schema';
import ollama from 'ollama';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Case.name) private caseModel: Model<Case>) {}

  private rooms: Map<string, Set<string>> = new Map();

  createRoom(roomName: string): void {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
  }

  deleteRoom(roomName: string): void {
    this.rooms.delete(roomName);
  }

  addUserToRoom(roomName: string, username: string): void {
    const room = this.rooms.get(roomName);
    if (room) {
      room.add(username);
    }
  }

  removeUserFromRoom(roomName: string, username: string): void {
    const room = this.rooms.get(roomName);
    if (room) {
      room.delete(username);
    }
  }

  getRooms(): string[] {
    return Array.from(this.rooms.keys());
  }

  getUsersInRoom(roomName: string): string[] {
    const room = this.rooms.get(roomName);
    return room ? Array.from(room) : [];
  }

  async processMessage(message: string): Promise<any> {
    console.log('Processing message:', message);

    const aiResponse = await ollama.chat({
      model: 'llama3',
      messages: [{ role: 'user', content: message }],
    });

    const response = aiResponse.message.content;

    return response;
  }
}
