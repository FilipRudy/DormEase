import { IsUUID } from 'class-validator';

export class EnrollStudentDto {
  @IsUUID()
  studentUuid: string;

  @IsUUID()
  courseUuid: string;
}
