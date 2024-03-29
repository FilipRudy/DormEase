import { Module } from '@nestjs/common';
import { DormitoryModule } from './module/dormitory.module';
import { StudentModule } from './module/student.module';
import { RoomModule } from './module/room.module';
import { DepartmentModule } from './module/department.module';
import { CourseModule } from './module/course.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbdatasource } from './datasource';
import { EnrollmentModule } from './module/enrollment.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DormitoryModule,
    StudentModule,
    RoomModule,
    DepartmentModule,
    CourseModule,
    EnrollmentModule,
    TypeOrmModule.forRoot(dbdatasource),
  ],
})
export class AppModule {}
