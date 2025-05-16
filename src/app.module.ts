import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { TaskGroupsController } from './task-groups/task-groups.controller';
import { TaskGroupsModule } from './task-groups/task-groups.module';
import { TaskGroup } from './task-groups/task-group.entity';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/task.entity';
import { RepeatModule } from './repeat/repeat.module';
import { Repeat } from './repeat/repeat.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, TaskGroup, Task, Repeat],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    TaskGroupsModule,
    TasksModule,
    RepeatModule
  ],
  controllers: [AppController, TaskGroupsController],
  providers: [AppService],
})
export class AppModule {}
