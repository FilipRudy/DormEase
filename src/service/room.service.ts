import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from '../entity/room';
import { Repository } from 'typeorm';
import { RoomResponseDto } from '../dto/response/roomResponse.dto';
import { AddRoomDto } from '../dto/request/addRoom.dto';
import { Dormitory } from '../entity/dormitory';
import { UpdateRoomDto } from '../dto/request/updateRoom.dto';
import { StudentService } from './student.service';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Dormitory)
    private dormitoryRepository: Repository<Dormitory>,
    private studentService: StudentService
  ) {}

  async findAll(): Promise<RoomResponseDto[]> {
    return await this.roomRepository.find();
  }

  async findOneById(roomUuid: string): Promise<RoomResponseDto> {
    if (
      !roomUuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + roomUuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return this.roomRepository.findOneByOrFail({ uuid: roomUuid }).catch(() => {
      throw new HttpException('Room with id: ' + roomUuid + ' was not found', HttpStatus.NOT_FOUND);
    });
  }

  async findAllByDormitoryId(dormitoryUuid: string): Promise<RoomResponseDto[]> {
    if (
      !dormitoryUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + dormitoryUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.roomRepository.find({
      where: {
        dormitoryUuid: dormitoryUuid,
      },
    });
  }

  async removeAllByDormitoryId(dormitoryUuid: string): Promise<string> {
    if (
      !dormitoryUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + dormitoryUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    const rooms: Room[] = await this.roomRepository.findBy({ dormitoryUuid: dormitoryUuid });

    for (const room of rooms) {
      await this.roomRepository.delete({ uuid: room.uuid }).catch(() => {
        throw new HttpException(
          'Room with id' + room.uuid + ' could not be deleted',
          HttpStatus.NOT_FOUND
        );
      });
    }

    return 'All rooms in dormitory with id: ' + dormitoryUuid + ' were successfully deleted';
  }

  async addRoom(addRoomDto: AddRoomDto): Promise<RoomResponseDto> {
    await this.dormitoryRepository
      .findOneByOrFail({
        uuid: addRoomDto.dormitoryUuid,
      })
      .catch(() => {
        throw new HttpException(
          'Dormitory with id' + addRoomDto.dormitoryUuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    const newRoom: Room = this.roomRepository.create({
      pricePerPerson: addRoomDto.pricePerPerson,
      size: addRoomDto.size,
      dormitoryUuid: addRoomDto.dormitoryUuid,
    });
    return await this.roomRepository.save({ ...newRoom });
  }

  async removeRoom(uuid: string): Promise<string> {
    const room = await this.roomRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Room with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });

    await this.studentService.removeAllByRoomId(room.uuid);

    await this.roomRepository.delete({ uuid: room.uuid }).catch(() => {
      throw new HttpException(
        'Room with id' + room.uuid + ' could not be deleted',
        HttpStatus.NOT_FOUND
      );
    });

    return 'Room with id' + room.uuid + ' was successfully deleted';
  }

  async updateRoom(updateRoomDto: UpdateRoomDto): Promise<string> {
    const room = await this.roomRepository
      .findOneByOrFail({ uuid: updateRoomDto.uuid })
      .catch(() => {
        throw new HttpException(
          'Room with id' + updateRoomDto.uuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.roomRepository.update(room, { ...updateRoomDto }).catch(() => {
      throw new HttpException(
        'Room with id' + room.uuid + ' could not be updated',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Room with id' + room.uuid + ' was successfully updated';
  }
}
