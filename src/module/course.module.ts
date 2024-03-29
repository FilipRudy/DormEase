import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseService } from '../service/course.service';
import { CourseController } from '../controller/course.controller';
import { Course } from '../entity/course';
import { Department } from '../entity/department';
@Module({
  imports: [TypeOrmModule.forFeature([Course, Department])],
  providers: [CourseService],
  controllers: [CourseController],
})
export class CourseModule {}
