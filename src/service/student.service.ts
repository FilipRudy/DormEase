import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entity/student';
import { AddStudentDto } from '../dto/request/addStudent.dto';
import { Room } from '../entity/room';
import { StudentResponseDto } from '../dto/response/studentResponse.dto';
import { UpdateStudentDto } from '../dto/request/updateStudent.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>
  ) {}

  async findAll(): Promise<StudentResponseDto[]> {
    return this.studentRepository.find();
  }
  async findOneById(uuid: string): Promise<StudentResponseDto> {
    if (
      !uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + uuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return this.studentRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Student with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });
  }
  async findAllByRoomId(roomUuid: string): Promise<StudentResponseDto[]> {
    if (
      !roomUuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + roomUuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    return await this.studentRepository.find({
      where: {
        roomUuid: roomUuid,
      },
    });
  }
  async removeAllByRoomId(roomUuid: string): Promise<string> {
    if (
      !roomUuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    ) {
      throw new HttpException('Uuid: ' + roomUuid + ' is not a valid uuid', HttpStatus.BAD_REQUEST);
    }

    const students: Student[] = await this.studentRepository.findBy({ roomUuid: roomUuid });

    for (const student of students) {
      await this.studentRepository.update(student, { ...student, roomUuid: null }).catch(() => {
        throw new HttpException(
          'Students within room id' + roomUuid + ' could not be removed from it',
          HttpStatus.NOT_FOUND
        );
      });
    }

    return 'All students in room with id: ' + roomUuid + ' were successfully removed from it';
  }
  async addStudent(addStudentDto: AddStudentDto): Promise<StudentResponseDto> {
    const currentStudent = await this.studentRepository.findOneBy({
      socialSecurityNumber: addStudentDto.socialSecurityNumber,
    });
    if (currentStudent !== null) {
      throw new HttpException('Student already exists', HttpStatus.BAD_REQUEST);
    }

    if (addStudentDto.roomUuid !== undefined) {
      await this.roomRepository
        .findOneByOrFail({
          uuid: addStudentDto.roomUuid,
        })
        .catch(() => {
          throw new HttpException(
            'Room with id' + addStudentDto.roomUuid + ' was not found',
            HttpStatus.NOT_FOUND
          );
        });
    }

    const newStudent: Student = this.studentRepository.create({
      name: addStudentDto.name,
      surname: addStudentDto.surname,
      socialSecurityNumber: addStudentDto.socialSecurityNumber,
      roomUuid: addStudentDto.roomUuid,
      departmentUuid: addStudentDto.departmentUuid,
    });
    return await this.studentRepository.save({ ...newStudent });
  }

  async removeStudent(uuid: string): Promise<string> {
    const student = await this.studentRepository.findOneByOrFail({ uuid: uuid }).catch(() => {
      throw new HttpException('Student with id' + uuid + ' was not found', HttpStatus.NOT_FOUND);
    });

    await this.studentRepository.delete({ uuid: student.uuid }).catch(() => {
      throw new HttpException(
        'Student with id' + student.uuid + ' could not be deleted',
        HttpStatus.NOT_FOUND
      );
    });

    return 'Student with id' + student.uuid + ' was successfully deleted';
  }

  async updateStudent(updateStudentDto: UpdateStudentDto): Promise<string> {
    const student = await this.studentRepository
      .findOneByOrFail({ uuid: updateStudentDto.uuid })
      .catch(() => {
        throw new HttpException(
          'Student with id' + updateStudentDto.uuid + ' was not found',
          HttpStatus.NOT_FOUND
        );
      });

    await this.studentRepository.update(student, { ...updateStudentDto }).catch(() => {
      throw new HttpException(
        'Student with id' + student.uuid + ' could not be updated',
        HttpStatus.BAD_REQUEST
      );
    });

    return 'Student with id' + student.uuid + ' was successfully updated';
  }
}
