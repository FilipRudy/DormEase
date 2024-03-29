import { IsUUID } from 'class-validator';

export class UpdateStudentEnrollmentDto {
  @IsUUID()
  enrollmentUuid: string;

  @IsUUID()
  courseUuid?: string;

  @IsUUID()
  studentUuid?: string;
}
