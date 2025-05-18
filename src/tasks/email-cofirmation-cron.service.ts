import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { EmailQueueService } from '../queue/services/email-queue.service';

@Injectable()
export class EmailConfirmationCronService {
  constructor(
    private readonly userService: UsersService,
    private readonly emailQueueService: EmailQueueService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const unconfirmedUsers = await this.userService.findUnconfirmedUser();

    for (const user of unconfirmedUsers) {
      if (user.confirmationToken) {
        await this.emailQueueService.sendConfirmationEmail(
          user.email,
          user.confirmationToken,
        );
      }
    }
  }
}
