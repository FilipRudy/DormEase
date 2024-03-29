import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dormitory } from '../entity/dormitory';
import { DormitoryController } from '../controller/dormitory.controller';
import { DormitoryService } from '../service/dormitory.service';
import { Room } from '../entity/room';
import { RoomModule } from './room.module';
import { Student } from '../entity/student';
import { StudentModule } from './student.module';

@Module({
  imports: [TypeOrmModule.forFeature([Dormitory, Room, Student]), RoomModule, StudentModule],
  providers: [DormitoryService],
  controllers: [DormitoryController],
})
export class DormitoryModule {}
