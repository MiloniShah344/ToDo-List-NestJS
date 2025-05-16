// src/repeat/repeat.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { RepeatService } from './repeat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repeat } from './repeat.entity';
import { Task } from '../tasks/task.entity';
import { TaskGroup } from '../task-groups/task-group.entity';
import { RepeatScheduler } from './repeat.scheduler';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';
import { TaskGroupsModule } from '../task-groups/task-groups.module';
import { TasksModule } from '../tasks/tasks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Repeat, Task, TaskGroup]),
    ScheduleModule.forRoot(),
    UsersModule,
    TaskGroupsModule,
    forwardRef(() => TasksModule),
  ],
  providers: [RepeatService, RepeatScheduler],
})
export class RepeatModule {}
