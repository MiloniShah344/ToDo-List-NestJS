import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly tasksService: TasksService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Request() req, @Body() dto: CreateTaskDto) {
    const user = await this.usersService.findById(req.user.userId);
    return this.tasksService.create(dto, user!);
  }

  @Get('group/:groupId')
  async findByGroup(@Request() req, @Param('groupId') groupId: string) {
    return this.tasksService.findAllByGroup(groupId, req.user.userId);
  }

  @Patch(':id')
  async update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(id, dto, req.user.userId);
  }

  @Delete(':id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.tasksService.delete(id, req.user.userId);
  }
}
