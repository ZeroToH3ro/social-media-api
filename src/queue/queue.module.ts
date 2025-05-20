import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { EmailQueueService } from './services/email-queue.service';
import { NotificationQueueService } from './services/notification-queue.service';
import { EmailQueueProcessor } from './processors/email-queue.processor';
import { NotificationQueueProcessor } from './processors/notification-queue.processor';
import { UsersModule } from '../users/users.module';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      },
    }),
    BullModule.registerQueue(
      {
        name: 'email',
        limiter: {
          max: 100,
          duration: 60000,
        },
      },
      {
        name: 'notification',
      },
    ),
    UsersModule,
    forwardRef(() => NotificationModule),
  ],
  providers: [
    EmailQueueService,
    NotificationQueueService,
    EmailQueueProcessor,
    NotificationQueueProcessor,
  ],
  exports: [EmailQueueService, NotificationQueueService],
})
export class QueueModule {}
