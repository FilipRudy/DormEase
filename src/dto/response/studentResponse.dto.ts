import { IsOptional, IsUUID } from 'class-validator';

export class StudentResponseDto {
  name: string;

  surname: string;

  socialSecurityNumber: string;

  @IsOptional()
  @IsUUID('all', { each: true })
  roomUuid: string;

  @IsOptional()
  departmentUuid: string;
}
