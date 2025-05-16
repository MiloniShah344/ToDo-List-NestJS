import { IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString, ValidateNested } from 'class-validator';
import { TaskPriority } from '../task.entity';
import { Type } from 'class-transformer';
import { CreateRepeatDto } from '../../repeat/dtos/create-repeat.dto';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueTime?: string;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsUUID()
  groupId: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRepeatDto)
  repeat?: CreateRepeatDto;
}
