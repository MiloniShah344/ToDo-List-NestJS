// src/repeats/repeat.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RepeatType } from './repeat-type.enum';


@Entity()
export class Repeat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RepeatType })
  type: RepeatType;

  @Column('simple-array', { nullable: true })
  daysOfWeek?: string[]; 
}
