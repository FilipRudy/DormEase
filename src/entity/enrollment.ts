import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Course } from './course';
import { Student } from './student';

@Entity('Enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  enrollmentUuid: string;

  @ManyToOne(() => Student, { eager: true })
  @JoinColumn({ name: 'student_uuid' })
  studentUuid: string;

  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: 'course_uuid' })
  courseUuid: string;
}
