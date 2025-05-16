// src/task-groups/task-groups.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskGroupsController } from './task-groups.controller';
import { TaskGroupsService } from './task-groups.service';
import { TaskGroup } from './task-group.entity';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { RepeatService } from 'src/repeat/repeat.service';
import { Repeat } from 'src/repeat/repeat.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { Task } from 'src/tasks/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskGroup, User, Repeat, Task])],
  controllers: [TaskGroupsController],
  providers: [TaskGroupsService, UsersService, RepeatService, TasksService],
  exports: [
    TaskGroupsService,
    TypeOrmModule
  ]
})
export class TaskGroupsModule {}
