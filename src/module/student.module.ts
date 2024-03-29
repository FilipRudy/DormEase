import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentService } from '../service/student.service';
import { StudentController } from '../controller/student.controller';
import { Student } from '../entity/student';
import { Room } from '../entity/room';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Room])],
  providers: [StudentService],
  controllers: [StudentController],
  exports: [StudentService],
})
export class StudentModule {}
