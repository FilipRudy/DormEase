import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddDepartmentDto } from '../dto/request/addDepartment.dto';
import { DepartmentResponseDto } from '../dto/response/departmentResponse.dto';
import { Department } from '../entity/department';
import { UpdateDepartmentDto } from '../dto/request/updateDepartment.dto';
import { Course } from '../entity/course';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department) private departmentRepository: Repository<Department>,
    @InjectRepository(Course) private courseRepository: Repository<Course>
  ) {}
  async findAll(): Promise<DepartmentResponseDto[]> {
    return this.departmentRepository.find();
  }
  async findOneById(uuid: string): Promise<DepartmentResponseDto> {
    if (
      !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + uuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return this.departmentRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Department with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });
  }
  async addDepartment(addDepartmentDto: AddDepartmentDto): Promise<DepartmentResponseDto> {
    const newDepartment: Department = this.departmentRepository.create({
      name: addDepartmentDto.name,
      city: addDepartmentDto.city,
      university: addDepartmentDto.university,
    });
    return await this.departmentRepository.save({ ...newDepartment });
  }

  async removeDepartment(uuid: string): Promise<string> {
    const department = await this.departmentRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException(
        'Department with id ' + uuid + ' was not found',
        HttpStatus.NOT_FOUND
      );
    });

    const courses = await this.courseRepository.findBy({ departmentUuid: uuid });
    for (const course of courses) {
      await this.courseRepository.delete(course).catch(() => {
        throw new HttpException(
          'Course with id' + course.uuid + ' could not be deleted',
          HttpStatus.BAD_REQUEST
        );
      });
    }

    await this.departmentRepository.delete({ uuid: department.uuid }).catch(() => {
      throw new HttpException(
        'Department with id' + department.uuid + ' could not be deleted',
        HttpStatus.BAD_REQUEST
      );
    });

    return (
      'Department with id ' + department.uuid + ' and all of its courses was successfully deleted'
    );
  }

  async updateDepartment(updateDepartmentDto: UpdateDepartmentDto): Promise<string> {
    const department = await this.departmentRepository
      .findOneByOrFail({ uuid: updateDepartmentDto.uuid })
      .catch(() => {
        throw new HttpException(
          'Department with id' + updateDepartmentDto.uuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.departmentRepository.update(department, { ...updateDepartmentDto }).catch(() => {
      throw new HttpException(
        'Department with id' + department.uuid + ' could not be updated',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Department with id' + department.uuid + ' was successfully updated';
  }
}
