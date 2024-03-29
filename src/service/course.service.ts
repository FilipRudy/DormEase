import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from '../entity/course';
import { CourseResponseDto } from '../dto/response/courseResponse.dto';
import { AddCourseDto } from '../dto/request/addCourse.dto';
import { UpdateCourseDto } from '../dto/request/updateCourse.dto';
import { Department } from '../entity/department';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(Course) private courseRepository: Repository<Course>,
    @InjectRepository(Department) private departmentRepository: Repository<Department>
  ) {}

  async findAll(): Promise<CourseResponseDto[]> {
    return this.courseRepository.find();
  }
  async findOneById(uuid: string): Promise<CourseResponseDto> {
    if (
      !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + uuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return this.courseRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Course with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });
  }
  async findAllByDepartmentId(departmentUuid: string): Promise<CourseResponseDto[]> {
    if (
      !departmentUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + departmentUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.courseRepository.find({
      where: {
        departmentUuid: departmentUuid,
      },
    });
  }
  async removeAllByDepartmentId(departmentUuid: string): Promise<string> {
    if (
      !departmentUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + departmentUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    const courses: Course[] = await this.courseRepository.findBy({
      departmentUuid: departmentUuid,
    });

    for (const course of courses) {
      await this.courseRepository.delete(course).catch(() => {
        throw new HttpException(
          'Courses within department id' + departmentUuid + ' could not be removed from it',
          HttpStatus.BAD_REQUEST
        );
      });
    }

    return (
      'All courses in department with id: ' + departmentUuid + ' were successfully removed from it'
    );
  }
  async addCourse(addCourseDto: AddCourseDto): Promise<CourseResponseDto> {
    if (addCourseDto.departmentUuid !== undefined) {
      await this.departmentRepository
        .findOneByOrFail({
          uuid: addCourseDto.departmentUuid,
        })
        .catch(() => {
          throw new HttpException(
            'Department with id' + addCourseDto.departmentUuid + ' was not found',
            HttpStatus.NOT_FOUND
          );
        });
    }

    const newCourse: Course = this.courseRepository.create({
      name: addCourseDto.name,
      departmentUuid: addCourseDto.departmentUuid,
    });
    return await this.courseRepository.save({ ...newCourse });
  }

  async removeCourse(uuid: string): Promise<string> {
    const course = await this.courseRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Course with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });

    await this.courseRepository.delete({ uuid: course.uuid }).catch(() => {
      throw new HttpException(
        'Course with id' + course.uuid + ' could not be deleted',
        HttpStatus.NOT_FOUND
      );
    });

    return 'Course with id' + course.uuid + ' was successfully deleted';
  }

  async updateCourse(updateCourseDto: UpdateCourseDto): Promise<string> {
    const course = await this.courseRepository
      .findOneByOrFail({ uuid: updateCourseDto.uuid })
      .catch(() => {
        throw new HttpException(
          'Course with id' + updateCourseDto.uuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.courseRepository.update(course, { ...updateCourseDto }).catch(() => {
      throw new HttpException(
        'Course with id' + course.uuid + ' could not be updated',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Course with id' + course.uuid + ' was successfully updated';
  }
}
