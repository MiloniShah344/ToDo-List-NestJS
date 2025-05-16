// src/repeat/repeat.scheduler.ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RepeatService } from './repeat.service';

@Injectable()
export class RepeatScheduler {
  private readonly logger = new Logger(RepeatScheduler.name);

  constructor(private readonly repeatService: RepeatService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
//   @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleRepeatTasks() {
    this.logger.log('⏰ Running repeat task scheduler...');
    await this.repeatService.processRepeats();
    this.logger.log('✅ Repeat processing done');
  }
}
