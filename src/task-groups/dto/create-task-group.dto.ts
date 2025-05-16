// src/task-groups/dto/create-task-group.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RepeatMode } from '../task-group.entity';
import { Type } from 'class-transformer';
import { CreateRepeatDto } from '../../repeat/dtos/create-repeat.dto';
import { ValidateNested } from 'class-validator';

export class CreateTaskGroupDto {
  @IsString()
  title: string;

  @IsEnum(RepeatMode)
  @IsOptional()
  repeatMode?: RepeatMode;

  @IsOptional()
  repeatTime?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRepeatDto)
  repeat?: CreateRepeatDto;
}
