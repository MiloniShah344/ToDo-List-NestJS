// src/task-groups/entities/task-group.entity.ts
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Task } from 'src/tasks/task.entity';
import { Repeat } from 'src/repeat/repeat.entity';

export enum RepeatMode {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  NEVER = 'NEVER',
}

@Entity()
export class TaskGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: RepeatMode,
    default: RepeatMode.NEVER,
  })
  repeatMode: RepeatMode;

  @Column({ type: 'time', nullable: true })
  repeatTime: string;

  @ManyToOne(() => User, (user) => user.taskGroups, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Task, (task) => task.group)
  tasks: Task[];

  @ManyToOne(() => Repeat, { nullable: true, eager: true, cascade: true })
  @JoinColumn({ name: 'repeatId' })
  repeat?: Repeat;
}
