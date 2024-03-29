import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddDormitoryDto } from '../dto/request/addDormitory.dto';
import { DormitoryResponseDto } from '../dto/response/dormitoryResponse.dto';
import { Dormitory } from '../entity/dormitory';
import { UpdateDormitoryDto } from '../dto/request/updateDormitory.dto';
import { RoomService } from './room.service';
import { StudentService } from './student.service';
import { Room } from '../entity/room';

@Injectable()
export class DormitoryService {
  constructor(
    @InjectRepository(Dormitory) private dormitoryRepository: Repository<Dormitory>,
    @InjectRepository(Room) private roomRepository: Repository<Room>,
    private roomService: RoomService,
    private studentService: StudentService
  ) {}
  async findAll(): Promise<DormitoryResponseDto[]> {
    return this.dormitoryRepository.find();
  }
  async findOneById(uuid: string): Promise<DormitoryResponseDto> {
    if (
      !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + uuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return this.dormitoryRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Dormitory with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });
  }
  async addDormitory(addDormitoryDto: AddDormitoryDto): Promise<DormitoryResponseDto> {
    const newDormitory: Dormitory = this.dormitoryRepository.create({
      name: addDormitoryDto.name,
      city: addDormitoryDto.city,
      street: addDormitoryDto.street,
      postalCode: addDormitoryDto.postalCode,
    });
    return await this.dormitoryRepository.save({ ...newDormitory });
  }

  async removeDormitory(uuid: string): Promise<string> {
    const dormitory = await this.dormitoryRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Dormitory with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });

    const rooms = await this.roomRepository.findBy({ dormitoryUuid: uuid });
    for (const room of rooms) {
      await this.studentService.removeAllByRoomId(room.uuid);
    }

    await this.roomService.removeAllByDormitoryId(dormitory.uuid);

    await this.dormitoryRepository.delete({ uuid: dormitory.uuid }).catch(() => {
      throw new HttpException(
        'Dormitory with id' + dormitory.uuid + ' could not be deleted',
        HttpStatus.NOT_FOUND
      );
    });

    return 'Dormitory with id ' + dormitory.uuid + ' and all of its rooms was successfully deleted';
  }

  async updateDormitory(updateDormitoryDto: UpdateDormitoryDto): Promise<string> {
    const dormitory = await this.dormitoryRepository
      .findOneByOrFail({ uuid: updateDormitoryDto.uuid })
      .catch(() => {
        throw new HttpException(
          'Dormitory with id' + updateDormitoryDto.uuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.dormitoryRepository.update(dormitory, { ...updateDormitoryDto }).catch(() => {
      throw new HttpException(
        'Dormitory with id' + dormitory.uuid + ' could not be updated',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Dormitory with id' + dormitory.uuid + ' was successfully updated';
  }
}
