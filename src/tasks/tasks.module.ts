import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { EmailConfirmationCronService } from './email-cofirmation-cron.service';

@Module({
  imports: [UsersModule],
  providers: [EmailConfirmationCronService],
})
export class TasksModule {}
