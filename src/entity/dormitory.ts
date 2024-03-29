import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Dormitories')
export class Dormitory {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  postalCode: string;
}
