import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  university: string;
}
