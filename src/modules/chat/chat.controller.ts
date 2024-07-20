// src/chat/chat.controller.ts
import { Controller, Post, Delete, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('room')
  createRoom(@Body('name') roomName: string) {
    this.chatService.createRoom(roomName);
    return { message: 'Room created successfully' };
  }

  @Delete('room/:name')
  deleteRoom(@Param('name') roomName: string) {
    this.chatService.deleteRoom(roomName);
    return { message: 'Room deleted successfully' };
  }

  @Get('rooms')
  getRooms() {
    return this.chatService.getRooms();
  }

  @Get('room/:name/users')
  getUsersInRoom(@Param('name') roomName: string) {
    return this.chatService.getUsersInRoom(roomName);
  }
}
