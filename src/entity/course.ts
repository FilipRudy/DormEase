import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Department } from './department';

@Entity('Courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column({ name: 'department_uuid' })
  departmentUuid: string;

  @JoinColumn({ name: 'department_uuid' })
  @ManyToOne(() => Department)
  department: Department;
}
