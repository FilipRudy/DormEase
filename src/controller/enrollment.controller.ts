import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { EnrollmentService } from '../service/enrollment.service';
import { EnrollStudentDto } from '../dto/request/enrollStudent.dto';
import { EnrollStudentResponseDto } from '../dto/response/enrollStudentResponse.dto';
import { UpdateStudentEnrollmentDto } from '../dto/request/updateStudentEnrollment.dto';

@ApiTags('enrollment')
@Controller('enrollment')
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  @Get()
  async findAll(): Promise<EnrollStudentResponseDto[]> {
    return this.enrollmentService.findAll();
  }
  @Get(`/dormitory/:uuid`)
  async findAllByStudentId(
    @Param('uuid', ValidationPipe) uuid: string
  ): Promise<EnrollStudentResponseDto[]> {
    return await this.enrollmentService.findAllByStudentId(uuid);
  }
  @Get(`/course/:uuid`)
  async findAllByCourseId(
    @Param('uuid', ValidationPipe) uuid: string
  ): Promise<EnrollStudentResponseDto[]> {
    return await this.enrollmentService.findAllByCourseId(uuid);
  }
  @Get(`/:uuid`)
  async findOne(@Param('uuid', ValidationPipe) uuid: string): Promise<EnrollStudentResponseDto> {
    return await this.enrollmentService.findOneById(uuid);
  }

  @Post('/add')
  async addEnrollment(
    @Body(ValidationPipe) addEnrollmentDto: EnrollStudentDto
  ): Promise<EnrollStudentResponseDto> {
    return await this.enrollmentService.enrollStudent(addEnrollmentDto);
  }

  @Delete('/remove/:uuid')
  async removeEnrollment(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.enrollmentService.removeEnrollment(uuid);
  }
  @Delete('/remove/student/:uuid')
  async removeEnrollmentsByStudentId(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.enrollmentService.removeAllByStudentId(uuid);
  }
  @Delete('/remove/course/:uuid')
  async removeEnrollmentsByCourseId(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.enrollmentService.removeAllByCourseId(uuid);
  }

  @Put('/update')
  async updateEnrollment(
    @Body(ValidationPipe) updateEnrollmentDto: UpdateStudentEnrollmentDto
  ): Promise<string> {
    return await this.enrollmentService.updateEnrollment(updateEnrollmentDto);
  }
}
