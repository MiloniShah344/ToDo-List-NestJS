import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { TaskGroup } from '../task-groups/task-group.entity';
import { User } from '../users/user.entity';
import { Repeat } from 'src/repeat/repeat.entity';

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  dueTime?: Date;

  @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Column({ default: false })
  isCompleted: boolean;

  @ManyToOne(() => TaskGroup, (group) => group.tasks, { onDelete: 'CASCADE' })
  group: TaskGroup;

  @ManyToOne(() => User, (user) => user.tasks, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Repeat, { nullable: true, eager: true, cascade: true })
  @JoinColumn({ name: 'repeatId' })
  repeat?: Repeat;
}
