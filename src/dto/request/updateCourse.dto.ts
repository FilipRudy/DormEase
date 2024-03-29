import { IsUUID } from 'class-validator';

export class UpdateCourseDto {
  @IsUUID()
  uuid: string;

  name: string;

  departmentUuid: string;
}
