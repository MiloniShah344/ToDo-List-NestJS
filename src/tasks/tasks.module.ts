import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from '../users/users.module';
import { TaskGroupsModule } from '../task-groups/task-groups.module';
import { RepeatService } from 'src/repeat/repeat.service';
import { RepeatModule } from 'src/repeat/repeat.module';
import { Repeat } from 'src/repeat/repeat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Repeat]), 
    UsersModule, 
    forwardRef(() => TaskGroupsModule),
    forwardRef(() => RepeatModule)
  ],
  providers: [TasksService, RepeatService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
