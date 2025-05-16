import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from '../users/users.service';
import { TaskGroupsService } from '../task-groups/task-groups.service';
import { User } from 'src/users/user.entity';
import { RepeatService } from 'src/repeat/repeat.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepo: Repository<Task>,
    private usersService: UsersService,
    private taskGroupsService: TaskGroupsService,
    private repeatService: RepeatService,
  ) {}

  async create(createDto: CreateTaskDto, user: User) {
    // const user = await this.usersService.findById(userId);
    console.log('User in TsksService (create)', user);
    const group = await this.taskGroupsService.findOne(createDto.groupId, user);

    const task = this.taskRepo.create({
      ...createDto,
      dueTime: createDto.dueTime ? new Date(createDto.dueTime) : undefined,
      user,
      group,
    });

    if (createDto.repeat) {
      const repeat = await this.repeatService.create(createDto.repeat);
      task.repeat = repeat;
    }

    return this.taskRepo.save(task);
  }

  async findAllByGroup(groupId: string, userId: string) {
    return this.taskRepo.find({
      where: { group: { id: groupId }, user: { id: userId } },
      order: { dueTime: 'ASC' },
    });
  }

  async update(id: string, updateDto: UpdateTaskDto, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) throw new NotFoundException('Task not found');

    if (updateDto.dueTime) {
      updateDto.dueTime = new Date(updateDto.dueTime) as any;
    }

    Object.assign(task, updateDto);
    return this.taskRepo.save(task);
  }

  async delete(id: string, userId: string) {
    const task = await this.taskRepo.findOne({
      where: { id, user: { id: userId } },
    });

    if (!task) throw new NotFoundException('Task not found');

    return this.taskRepo.remove(task);
  }
}
