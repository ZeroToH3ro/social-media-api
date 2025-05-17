import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailConfirmationCronService {
  constructor(
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const unconfirmedUsers = await this.userService.findUnconfirmedUser();

    for (const user of unconfirmedUsers) {
      if (user.confirmationToken) {
        await this.sendConfirmationEmail(user.email, user.confirmationToken);
      }
    }
  }

  async sendConfirmationEmail(email: string, token: string) {
    const app = process.env.DOMAIN_BE ?? 'http://localhost:3000';
    const confirmationUrl = `${app}/confirm?token=${token}`;

    await this.mailerService.sendMail({
      from: '"Z3ro App" z3ro@gmail.com',
      to: email,
      subject: 'Please confirm your email',
      html: `<p>Click <a href="${confirmationUrl}">here</a> to confirm your email.`,
    });
  }
}
