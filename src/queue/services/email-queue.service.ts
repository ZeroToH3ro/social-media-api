import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export enum EmailType {
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password-reset',
  EMAIL_CONFIRMATION = 'email-confirmation',
  NOTIFICATION = 'notification',
  POST_LIKED = 'post-liked',
  NEW_FOLLOWER = 'new-follower',
  NEW_COMMENT = 'new-comment',
}

interface EmailJobData {
  to: string;
  subject: string;
  template: EmailType;
  data: Record<string, any>;
}

@Injectable()
export class EmailQueueService {
  constructor(@InjectQueue('email') private emailQueue: Queue) {}

  async addEmailJob(data: EmailJobData) {
    return this.emailQueue.add('send-email', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
      removeOnComplete: true,
    });
  }

  async sendWelcomeEmail(email: string, username: string) {
    return this.addEmailJob({
      to: email,
      subject: 'Welcome to Social Media Platform',
      template: EmailType.WELCOME,
      data: { username },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const app = process.env.DOMAIN_BE ?? 'http://localhost:3000';
    const confirmationUrl = `${app}/users/confirm?token=${token}`;

    return this.addEmailJob({
      to: email,
      subject: 'Please confirm your email',
      template: EmailType.EMAIL_CONFIRMATION,
      data: {
        confirmationUrl,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const app = process.env.DOMAIN_BE ?? 'http://localhost:3000';
    const resetUrl = `${app}/auth/reset-password?token=${token}`;

    return this.addEmailJob({
      to: email,
      subject: 'Reset your password',
      template: EmailType.PASSWORD_RESET,
      data: {
        resetUrl,
      },
    });
  }

  async sendPostLikedNotification(
    email: string,
    username: string,
    postTitle: string,
  ) {
    return this.addEmailJob({
      to: email,
      subject: 'Your post was liked',
      template: EmailType.POST_LIKED,
      data: {
        username,
        postTitle,
      },
    });
  }

  async sendNewFollowerNotification(email: string, followerUsername: string) {
    return this.addEmailJob({
      to: email,
      subject: 'You have a new follower',
      template: EmailType.NEW_FOLLOWER,
      data: {
        followerUsername,
      },
    });
  }

  async sendNewCommentNotification(
    email: string,
    username: string,
    postTitle: string,
  ) {
    return this.addEmailJob({
      to: email,
      subject: 'New comment on your post',
      template: EmailType.NEW_COMMENT,
      data: {
        username,
        postTitle,
      },
    });
  }
}
