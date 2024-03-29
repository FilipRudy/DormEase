import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Room } from './room';
import { Department } from './department';

@Entity('Students')
export class Student {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  surname: string;

  @Column({ name: 'social_security_number' })
  socialSecurityNumber: string;

  @Column({ name: 'room_uuid', nullable: true })
  roomUuid: string;

  @Column({ name: 'department_uuid', nullable: true })
  departmentUuid: string;

  @JoinColumn({ name: 'room_uuid' })
  @ManyToOne(() => Room)
  room: Room;

  @JoinColumn({ name: 'department_uuid' })
  @ManyToOne(() => Department)
  department: Department;
}
