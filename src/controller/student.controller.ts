import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { StudentService } from '../service/student.service';
import { AddStudentDto } from '../dto/request/addStudent.dto';
import { StudentResponseDto } from '../dto/response/studentResponse.dto';
import { UpdateStudentDto } from '../dto/request/updateStudent.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('student')
@Controller('student')
export class StudentController {
  constructor(private studentService: StudentService) {}

  @Get()
  async findAll(): Promise<StudentResponseDto[]> {
    return await this.studentService.findAll();
  }
  @Get(`/:uuid`)
  async findOne(@Param('uuid', ValidationPipe) uuid: string): Promise<StudentResponseDto> {
    return await this.studentService.findOneById(uuid);
  }

  @Get(`/student/:uuid`)
  async findAllByRoomId(
    @Param('uuid', ValidationPipe) uuid: string
  ): Promise<StudentResponseDto[]> {
    return await this.studentService.findAllByRoomId(uuid);
  }
  @Post('/add')
  async addStudent(
    @Body(ValidationPipe) addStudentDto: AddStudentDto
  ): Promise<StudentResponseDto> {
    return await this.studentService.addStudent(addStudentDto);
  }
  @Delete('/remove/:uuid')
  async removeStudent(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.studentService.removeStudent(uuid);
  }

  @Put('/update')
  async updateStudent(@Body(ValidationPipe) updateStudentDto: UpdateStudentDto): Promise<string> {
    return await this.studentService.updateStudent(updateStudentDto);
  }
}
