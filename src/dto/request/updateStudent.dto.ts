import { IsOptional, IsUUID } from 'class-validator';

export class UpdateStudentDto {
  @IsUUID()
  uuid: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  surname?: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  roomUuid?: string;

  @IsOptional()
  departmentUuid?: string;
}
