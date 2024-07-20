// src/chat/chat.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {
  private rooms: Map<string, Set<string>> = new Map();

  createRoom(roomName: string): void {
    if (!this.rooms.has(roomName)) {
      this.rooms.set(roomName, new Set());
    }
    console.log(this.rooms.get(roomName));
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
}
