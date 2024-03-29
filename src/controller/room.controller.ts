import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { RoomService } from '../service/room.service';
import { AddRoomDto } from '../dto/request/addRoom.dto';
import { UpdateRoomDto } from '../dto/request/updateRoom.dto';
import { RoomResponseDto } from '../dto/response/roomResponse.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('room')
@Controller('room')
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get()
  async findAll(): Promise<RoomResponseDto[]> {
    return this.roomService.findAll();
  }
  @Get(`/dormitory/:uuid`)
  async findAllByDormitoryId(
    @Param('uuid', ValidationPipe) uuid: string
  ): Promise<RoomResponseDto[]> {
    return await this.roomService.findAllByDormitoryId(uuid);
  }
  @Get(`/:uuid`)
  async findOne(@Param('uuid', ValidationPipe) uuid: string): Promise<RoomResponseDto> {
    return await this.roomService.findOneById(uuid);
  }

  @Post('/add')
  async addRoom(@Body(ValidationPipe) addRoomDto: AddRoomDto): Promise<RoomResponseDto> {
    return await this.roomService.addRoom(addRoomDto);
  }

  @Delete('/remove/:uuid')
  async removeRoom(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.roomService.removeRoom(uuid);
  }

  @Put('/update')
  async updateRoom(@Body(ValidationPipe) updateRoomDto: UpdateRoomDto): Promise<string> {
    return await this.roomService.updateRoom(updateRoomDto);
  }
}
