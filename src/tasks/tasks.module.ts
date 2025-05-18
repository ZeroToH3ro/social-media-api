import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationCronService } from './email-cofirmation-cron.service';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [UsersModule, QueueModule],
  providers: [EmailConfirmationCronService],
})
export class TasksModule {}
