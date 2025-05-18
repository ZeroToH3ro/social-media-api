import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailQueueService } from './queue/services/email-queue.service';
import { NotificationQueueService } from './queue/services/notification-queue.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly emailQueueService: EmailQueueService,
    private readonly notificationQueueService: NotificationQueueService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test-email-queue')
  async testEmailQueue() {
    await this.emailQueueService.sendWelcomeEmail(
      'test@example.com',
      'TestUser',
    );
    return { success: true, message: 'Email job added to queue' };
  }

  @Get('test-notification-queue')
  async testNotificationQueue() {
    await this.notificationQueueService.createNewFollowerNotification(1, 2);
    return { success: true, message: 'Notification job added to queue' };
  }
}
