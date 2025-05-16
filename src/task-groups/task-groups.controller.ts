// src/task-groups/task-groups.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TaskGroupsService } from './task-groups.service';
import { CreateTaskGroupDto } from './dto/create-task-group.dto';
import { UpdateTaskGroupDto } from './dto/update-task-group.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from 'src/users/users.service';

@UseGuards(JwtAuthGuard)
@Controller('task-groups')
export class TaskGroupsController {
  constructor(
    private readonly taskGroupsService: TaskGroupsService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(@Body() dto: CreateTaskGroupDto, @Request() req) {
    // console.log("User: ", user);
    const user = await this.usersService.findById(req.user.userId);
    return this.taskGroupsService.create(dto, user!);
  }

  @Get()
  async findAll(@Request() req) {
  // findAll(@Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    console.log("User in controller: ", user);
    return this.taskGroupsService.findAll(user!);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return this.taskGroupsService.findOne(id, user!);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTaskGroupDto,
    @Request() req,
  ) {
    const user = await this.usersService.findById(req.user.userId);
    return this.taskGroupsService.update(id, dto, user!);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    const user = await this.usersService.findById(req.user.userId);
    return this.taskGroupsService.remove(id, user!);
  }
}
