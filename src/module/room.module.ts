import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from '../entity/room';
import { RoomService } from '../service/room.service';
import { Dormitory } from '../entity/dormitory';
import { RoomController } from '../controller/room.controller';
import { StudentModule } from './student.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Dormitory]), StudentModule],
  providers: [RoomService],
  controllers: [RoomController],
  exports: [RoomService],
})
export class RoomModule {}
