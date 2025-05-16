import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repeat } from './repeat.entity';
import { Not, Repository } from 'typeorm';
import { CreateRepeatDto } from './dtos/create-repeat.dto';
import { UpdateRepeatDto } from './dtos/update-repeat.dto';
import { RepeatType } from './repeat-type.enum';
import { Task } from 'src/tasks/task.entity';
import { TaskGroup } from 'src/task-groups/task-group.entity';

@Injectable()
export class RepeatService {
  logger: any;

  constructor(
    @InjectRepository(Repeat) private readonly repeatRepo: Repository<Repeat>,
    @InjectRepository(Task) private taskRepo: Repository<Task>,
    @InjectRepository(TaskGroup) private taskGroupRepo: Repository<TaskGroup>
  ) {}

  async create(dto: CreateRepeatDto): Promise<Repeat> {
    const repeat = this.repeatRepo.create(dto);
    return this.repeatRepo.save(repeat);
  }

  async update(id: string, dto: UpdateRepeatDto): Promise<Repeat | null> {
    await this.repeatRepo.update(id, dto);
    return this.repeatRepo.findOneBy({ id });
  }

  async findById(id: string): Promise<Repeat | null> {
    return this.repeatRepo.findOneBy({ id });
  }

  async delete(id: string): Promise<void> {
    await this.repeatRepo.delete(id);
  }

  async processRepeats() {
    const now = new Date();
    console.log("ProcessRepeats running...")
    // 1. Update TASK GROUPS
    const groups = await this.taskGroupRepo.find({
      where: { repeat: { type: Not(RepeatType.NEVER) } },
      relations: ['repeat'],
    });

    for (const group of groups) {
      if (!group.repeat) continue;

      const nextRepeatTime = this.getNextRepeatTime(group.repeat, group.repeatTime);

      if (group.repeatTime && this.shouldRepeat(group.repeatTime, nextRepeatTime)) {
        group.repeatTime = nextRepeatTime.toTimeString().split(' ')[0];
        await this.taskGroupRepo.save(group);
        this.logger?.log?.(`🔁 Updated TaskGroup "${group.title}" next repeat time to ${group.repeatTime}`);
      }
    }

    // 2. Update TASKS
    const tasks = await this.taskRepo.find({
      where: { repeat: { type: Not(RepeatType.NEVER) } },
      relations: ['repeat'],
    });

    for (const task of tasks) {
      if (!task.repeat || !task.dueTime) continue;

      const nextDueTime = this.getNextRepeatDate(task.repeat, task.dueTime);

      if (this.shouldRepeat(task.dueTime, nextDueTime)) {
        task.dueTime = nextDueTime;
        task.isCompleted = false;
        task.updatedAt = new Date();
        await this.taskRepo.save(task);
        this.logger?.log?.(`🔁 Updated Task "${task.title}" dueTime to ${task.dueTime}`);
      }
    }
  }

  private getNextRepeatDate(repeat: Repeat, fromDate: Date): Date {
    const next = new Date(fromDate);

    switch (repeat.type) {
      case RepeatType.DAILY:
        next.setDate(next.getDate() + 1);
        break;
      case RepeatType.WEEKLY:
        next.setDate(next.getDate() + 7);
        break;
      default:
        return fromDate;
    }

    return next;
  }

  private getNextRepeatTime(repeat: Repeat, currentTimeStr: string): Date {
    const now = new Date();
    const [hours, minutes, seconds] = currentTimeStr?.split(':')?.map(Number) || [0, 0, 0];
    const base = new Date(now);
    base.setHours(hours, minutes, seconds || 0);

    switch (repeat.type) {
      case RepeatType.DAILY:
        base.setDate(now.getDate() + 1);
        break;
      case RepeatType.WEEKLY:
        base.setDate(now.getDate() + 7);
        break;
      default:
        return now;
    }

    return base;
  }

  private shouldRepeat(current: Date | string, next: Date): boolean {
    const currentDate = typeof current === 'string'
      ? new Date(`1970-01-01T${current}`)
      : new Date(current);

    const now = new Date();
    return now >= currentDate;
  }

  /**
   * 🛑 This function previously CREATED new task entries.
   * ✅ Now it just updates existing tasks with new dueTime.
   */
  private async processTaskRepeats() {
    const tasks = await this.taskRepo.find({
      where: { repeat: { type: Not(RepeatType.NEVER) } },
      relations: ['repeat'],
    });

    for (const task of tasks) {
      if (!task.repeat || !task.dueTime) continue;

      const nextDue = this.getNextDueDate(task.dueTime, task.repeat.type);
      if (!nextDue) continue;

      task.dueTime = nextDue;
      task.isCompleted = false;
      task.updatedAt = new Date();

      await this.taskRepo.save(task);
      this.logger?.log?.(`🔁 Updated Task "${task.title}" with new due time ${nextDue}`);
    }
  }

  private async processGroupRepeats() {
    const groups = await this.taskGroupRepo.find({
      where: { repeat: { type: Not(RepeatType.NEVER) } },
      relations: ['repeat'],
    });

    for (const group of groups) {
      if (!group.repeat || !group.repeatTime) continue;

      const nextRepeatTime = this.getNextRepeatTime(group.repeat, group.repeatTime);
      if (!this.shouldRepeat(group.repeatTime, nextRepeatTime)) continue;

      group.repeatTime = nextRepeatTime.toTimeString().split(' ')[0];
      group.updatedAt = new Date();

      await this.taskGroupRepo.save(group);
      this.logger?.log?.(`🔁 Updated Group "${group.title}" with next repeat time ${group.repeatTime}`);
    }
  }

  private getNextDueDate(current: Date, type: RepeatType): Date | null {
    if (!current) return null;

    const next = new Date(current);
    switch (type) {
      case RepeatType.DAILY:
        next.setDate(next.getDate() + 1);
        return next;
      case RepeatType.WEEKLY:
        next.setDate(next.getDate() + 7);
        return next;
      default:
        return null;
    }
  }
}
