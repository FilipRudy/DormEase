import { IsUUID } from 'class-validator';

export class AddCourseDto {
  name: string;

  @IsUUID()
  departmentUuid: string;
}
