import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { DepartmentService } from '../service/department.service';
import { DepartmentResponseDto } from '../dto/response/departmentResponse.dto';
import { AddDepartmentDto } from '../dto/request/addDepartment.dto';
import { UpdateDepartmentDto } from '../dto/request/updateDepartment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('department')
@Controller('department')
export class DepartmentController {
  constructor(private departmentService: DepartmentService) {}

  @Get()
  async findAll(): Promise<DepartmentResponseDto[]> {
    return await this.departmentService.findAll();
  }
  @Get(`/:uuid`)
  async findOne(@Param('uuid', ValidationPipe) uuid: string): Promise<DepartmentResponseDto> {
    return await this.departmentService.findOneById(uuid);
  }
  @Post('/add')
  async addDepartment(
    @Body(ValidationPipe) addDepartmentDto: AddDepartmentDto
  ): Promise<DepartmentResponseDto> {
    return await this.departmentService.addDepartment(addDepartmentDto);
  }

  @Delete('/remove/:uuid')
  async removeDepartment(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.departmentService.removeDepartment(uuid);
  }

  @Put('/update')
  async updateDepartment(
    @Body(ValidationPipe) updateDepartmentDto: UpdateDepartmentDto
  ): Promise<string> {
    return await this.departmentService.updateDepartment(updateDepartmentDto);
  }
}
