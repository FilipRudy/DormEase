import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Enrollment } from '../entity/enrollment';
import { Repository } from 'typeorm';
import { EnrollStudentDto } from '../dto/request/enrollStudent.dto';
import { Student } from '../entity/student';
import { Course } from '../entity/course';
import { UpdateStudentEnrollmentDto } from '../dto/request/updateStudentEnrollment.dto';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment) private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student) private studentRepository: Repository<Student>,
    @InjectRepository(Course) private courseRepository: Repository<Course>
  ) {}

  async findAll(): Promise<EnrollStudentDto[]> {
    return this.enrollmentRepository.find();
  }
  async findOneById(uuid: string): Promise<EnrollStudentDto> {
    if (
      !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + uuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return this.enrollmentRepository.findOneByOrFail({ enrollmentUuid: uuid }).catch(() => {
      throw new HttpException('Enrollment with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });
  }
  async findAllByStudentId(studentUuid: string): Promise<EnrollStudentDto[]> {
    if (
      !studentUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + studentUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.enrollmentRepository.find({
      where: {
        studentUuid: studentUuid,
      },
    });
  }
  async findAllByCourseId(courseUuid: string): Promise<EnrollStudentDto[]> {
    if (
      !courseUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + courseUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    return await this.enrollmentRepository.find({
      where: {
        studentUuid: courseUuid,
      },
    });
  }
  async removeAllByCourseId(courseUuid: string): Promise<string> {
    if (
      !courseUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + courseUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    const enrollments: Enrollment[] = await this.enrollmentRepository.findBy({
      courseUuid: courseUuid,
    });

    for (const enrollment of enrollments) {
      await this.enrollmentRepository.delete(enrollment).catch(() => {
        throw new HttpException(
          'Enrollment with course id' + courseUuid + ' could not be removed',
          HttpStatus.NOT_FOUND
        );
      });
    }

    return 'All enrollments with course id: ' + courseUuid + ' were successfully removed';
  }
  async removeAllByStudentId(studentUuid: string): Promise<string> {
    if (
      !studentUuid.match(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    ) {
      throw new HttpException(
        'Uuid: ' + studentUuid + ' is not a valid uuid',
        HttpStatus.BAD_REQUEST
      );
    }

    const enrollments: Enrollment[] = await this.enrollmentRepository.findBy({
      courseUuid: studentUuid,
    });

    for (const enrollment of enrollments) {
      await this.enrollmentRepository.delete(enrollment).catch(() => {
        throw new HttpException(
          'Enrollment with student id' + studentUuid + ' could not be removed',
          HttpStatus.NOT_FOUND
        );
      });
    }

    return 'All enrollments with student id: ' + studentUuid + ' were successfully removed';
  }
  async enrollStudent(enrollStudentDto: EnrollStudentDto): Promise<EnrollStudentDto> {
    const currentEnrollment = await this.enrollmentRepository.findOneBy({
      courseUuid: enrollStudentDto.courseUuid,
      studentUuid: enrollStudentDto.studentUuid,
    });
    if (currentEnrollment !== null) {
      throw new HttpException('Student is already enrolled', HttpStatus.BAD_REQUEST);
    }

    if (enrollStudentDto.courseUuid !== undefined) {
      await this.courseRepository
        .findOneByOrFail({
          uuid: enrollStudentDto.courseUuid,
        })
        .catch(() => {
          throw new HttpException(
            'Course with id' + enrollStudentDto.courseUuid + ' was not found',
            HttpStatus.NOT_FOUND
          );
        });
    }
    if (enrollStudentDto.studentUuid !== undefined) {
      await this.studentRepository
        .findOneByOrFail({
          uuid: enrollStudentDto.studentUuid,
        })
        .catch(() => {
          throw new HttpException(
            'Student with id' + enrollStudentDto.studentUuid + ' was not found',
            HttpStatus.NOT_FOUND
          );
        });
    }

    const newEnrollment: Enrollment = this.enrollmentRepository.create({
      studentUuid: enrollStudentDto.studentUuid,
      courseUuid: enrollStudentDto.courseUuid,
    });
    return await this.enrollmentRepository.save({ ...newEnrollment });
  }

  async removeEnrollment(uuid: string): Promise<string> {
    const enrollment = await this.enrollmentRepository
      .findOneByOrFail({ enrollmentUuid: uuid })
      .catch(() => {
        throw new HttpException(
          'Enrollment with id' + uuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.enrollmentRepository.delete({ enrollmentUuid: uuid }).catch(() => {
      throw new HttpException(
        'Enrollment with id' + enrollment.enrollmentUuid + ' could not be deleted',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Enrollment with id' + enrollment.enrollmentUuid + ' was successfully deleted';
  }

  async updateEnrollment(updateEnrollmentDto: UpdateStudentEnrollmentDto): Promise<string> {
    const enrollment = await this.enrollmentRepository
      .findOneByOrFail({ enrollmentUuid: updateEnrollmentDto.enrollmentUuid })
      .catch(() => {
        throw new HttpException(
          'Enrollment with id' + updateEnrollmentDto.enrollmentUuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.enrollmentRepository.update(enrollment, { ...updateEnrollmentDto }).catch(() => {
      throw new HttpException(
        'Enrollment with id' + enrollment.enrollmentUuid + ' could not be updated',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Enrollment with id' + enrollment.enrollmentUuid + ' was successfully updated';
  }
}
