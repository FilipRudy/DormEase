import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Dormitory } from './dormitory';

@Entity('Rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  pricePerPerson: number;

  @Column()
  size: number;

  @Column({ name: 'dormitory_uuid' })
  dormitoryUuid: string;

  @ManyToOne(() => Dormitory)
  @JoinColumn({ name: 'dormitory_uuid' })
  dormitory: Dormitory;
}
