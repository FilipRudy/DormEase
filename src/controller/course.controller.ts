import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { CourseService } from '../service/course.service';
import { ApiTags } from '@nestjs/swagger';
import { CourseResponseDto } from '../dto/response/courseResponse.dto';
import { AddCourseDto } from '../dto/request/addCourse.dto';
import { UpdateCourseDto } from '../dto/request/updateCourse.dto';

@ApiTags('course')
@Controller('course')
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get()
  async findAll(): Promise<CourseResponseDto[]> {
    return await this.courseService.findAll();
  }
  @Get(`/:uuid`)
  async findOne(@Param('uuid', ValidationPipe) uuid: string): Promise<CourseResponseDto> {
    return await this.courseService.findOneById(uuid);
  }

  @Get(`/course/:uuid`)
  async findAllByDepartmentId(
    @Param('uuid', ValidationPipe) uuid: string
  ): Promise<CourseResponseDto[]> {
    return await this.courseService.findAllByDepartmentId(uuid);
  }
  @Post('/add')
  async addCourse(@Body(ValidationPipe) addCourseDto: AddCourseDto): Promise<CourseResponseDto> {
    return await this.courseService.addCourse(addCourseDto);
  }
  @Delete('/remove/:uuid')
  async removeCourse(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.courseService.removeCourse(uuid);
  }

  @Put('/update')
  async updateCourse(@Body(ValidationPipe) updateCourseDto: UpdateCourseDto): Promise<string> {
    return await this.courseService.updateCourse(updateCourseDto);
  }
}
