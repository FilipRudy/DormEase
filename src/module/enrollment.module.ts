import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../entity/student';
import { EnrollmentService } from '../service/enrollment.service';
import { Course } from '../entity/course';
import { Enrollment } from '../entity/enrollment';
import { EnrollmentController } from '../controller/enrollment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment, Student, Course])],
  providers: [EnrollmentService],
  controllers: [EnrollmentController],
})
export class EnrollmentModule {}
