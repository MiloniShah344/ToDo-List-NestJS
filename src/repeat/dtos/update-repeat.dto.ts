import { PartialType } from '@nestjs/mapped-types';
import { CreateRepeatDto } from './create-repeat.dto';

export class UpdateRepeatDto extends PartialType(CreateRepeatDto) {}
