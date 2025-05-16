import { TaskGroup } from 'src/task-groups/task-group.entity';
import { Task } from 'src/tasks/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TaskGroup, (group) => group.user)
  taskGroups: TaskGroup[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
