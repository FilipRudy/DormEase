import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from '../entity/department';
import { DepartmentService } from '../service/department.service';
import { DepartmentController } from '../controller/department.controller';
import { Course } from '../entity/course';

@Module({
  imports: [TypeOrmModule.forFeature([Department, Course])],
  providers: [DepartmentService],
  controllers: [DepartmentController],
})
export class DepartmentModule {}
