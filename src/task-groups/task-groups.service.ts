// src/task-groups/task-groups.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskGroup } from './task-group.entity';
import { Repository } from 'typeorm';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { User } from 'src/users/user.entity';

@Injectable()
export class TaskGroupsService {
  constructor(
    @InjectRepository(TaskGroup)
    private taskGroupRepo: Repository<TaskGroup>,
  ) {}

  async create(createDto: CreateTaskGroupDto, user: User) {
    const group = this.taskGroupRepo.create({ ...createDto, user });
    console.log("Group: ", group)
    return this.taskGroupRepo.save(group);
  }

  async findAll(user: User) {
    console.log("User in service: ", user);
    return this.taskGroupRepo.find({ where: { user: { id: user.id } } });
  }

  async findOne(id: string, user: User) {
    const group = await this.taskGroupRepo.findOne({ where: { id, user:{ id: user.id }  } });
    if (!group) throw new NotFoundException('Task group not found');
    return group;
  }

  async update(id: string, updateDto: UpdateTaskGroupDto, user: User) {
    const group = await this.findOne(id, user);
    Object.assign(group, updateDto);
    return this.taskGroupRepo.save(group);
  }

  async remove(id: string, user: User) {
    const group = await this.findOne(id, user);
    return this.taskGroupRepo.remove(group);
  }
}
