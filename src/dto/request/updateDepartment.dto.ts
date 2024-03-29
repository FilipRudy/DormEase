import { IsUUID } from 'class-validator';

export class UpdateDepartmentDto {
  @IsUUID()
  uuid: string;

  name: string;

  city: string;

  university: string;
}
