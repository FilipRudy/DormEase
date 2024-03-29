import { Body, Controller, Delete, Get, Param, Post, Put, ValidationPipe } from '@nestjs/common';
import { DormitoryService } from '../service/dormitory.service';
import { DormitoryResponseDto } from '../dto/response/dormitoryResponse.dto';
import { AddDormitoryDto } from '../dto/request/addDormitory.dto';
import { UpdateDormitoryDto } from '../dto/request/updateDormitory.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('dormitory')
@Controller('dormitory')
export class DormitoryController {
  constructor(private dormitoryService: DormitoryService) {}
  @ApiOperation({ description: 'Finds all dormitories' })
  @Get()
  async findAll(): Promise<DormitoryResponseDto[]> {
    return await this.dormitoryService.findAll();
  }
  @ApiOperation({ description: 'Finds one dormitory' })
  @Get(`/:uuid`)
  async findOne(@Param('uuid', ValidationPipe) uuid: string): Promise<DormitoryResponseDto> {
    return await this.dormitoryService.findOneById(uuid);
  }
  @ApiOperation({ description: 'Adds dormitory' })
  @Post('/add')
  async addDormitory(
    @Body(ValidationPipe) addDormitoryDto: AddDormitoryDto
  ): Promise<DormitoryResponseDto> {
    return await this.dormitoryService.addDormitory(addDormitoryDto);
  }

  @ApiOperation({ description: 'Deletes dormitory and all of its rooms' })
  @Delete('/remove/:uuid')
  async removeDormitory(@Param('uuid', ValidationPipe) uuid: string): Promise<string> {
    return await this.dormitoryService.removeDormitory(uuid);
  }

  @Put('/update')
  async updateDormitory(
    @Body(ValidationPipe) updateDormitoryDto: UpdateDormitoryDto
  ): Promise<string> {
    return await this.dormitoryService.updateDormitory(updateDormitoryDto);
  }
}
