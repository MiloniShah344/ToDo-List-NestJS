import { IsEnum, IsOptional, IsArray } from 'class-validator';
import { RepeatType } from '../repeat-type.enum';

export class CreateRepeatDto {
  @IsEnum(RepeatType)
  type: RepeatType;

  @IsOptional()
  @IsArray()
  daysOfWeek?: string[];
}
