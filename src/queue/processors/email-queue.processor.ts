import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { EmailType } from '../services/email-queue.service';

interface EmailJobData {
  to: string;
  subject: string;
  template: EmailType;
  data: {
    username?: string;
    confirmationUrl?: string;
    resetUrl?: string;
    postTitle?: string;
    followerUsername?: string;
  };
}

@Processor('email')
export class EmailQueueProcessor {
  private readonly logger = new Logger(EmailQueueProcessor.name);

  constructor(private readonly mailerService: MailerService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailJobData>) {
    this.logger.debug(
      `Processing email job ${job.id} of type ${job.data.template}`,
    );
    const { to, subject, template, data } = job.data;

    try {
      let html = '';

      switch (template) {
        case EmailType.WELCOME:
          html = this.getWelcomeEmailTemplate(data.username || 'User');
          break;
        case EmailType.EMAIL_CONFIRMATION:
          if (!data.confirmationUrl) {
            throw new Error(
              'Confirmation URL is required for email confirmation template',
            );
          }
          html = this.getConfirmationEmailTemplate(data.confirmationUrl);
          break;
        case EmailType.PASSWORD_RESET:
          if (!data.resetUrl) {
            throw new Error(
              'Reset URL is required for password reset template',
            );
          }
          html = this.getPasswordResetTemplate(data.resetUrl);
          break;
        case EmailType.POST_LIKED:
          html = this.getPostLikedTemplate(
            data.username || 'Someone',
            data.postTitle || 'your post',
          );
          break;
        case EmailType.NEW_FOLLOWER:
          html = this.getNewFollowerTemplate(
            data.followerUsername || 'Someone',
          );
          break;
        case EmailType.NEW_COMMENT:
          html = this.getNewCommentTemplate(
            data.username || 'Someone',
            data.postTitle || 'your post',
          );
          break;
        default:
          throw new Error(`Unknown email template: ${template}`);
      }

      await this.mailerService.sendMail({
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent to ${to} successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }

  private getWelcomeEmailTemplate(username: string): string {
    return `
      <div>
        <h1>Welcome to Social Media Platform!</h1>
        <p>Hello ${username},</p>
        <p>Thank you for joining our platform. We're excited to have you here!</p>
        <p>Get started by completing your profile and connecting with friends.</p>
      </div>
    `;
  }

  private getConfirmationEmailTemplate(confirmationUrl: string): string {
    return `
      <div>
        <h1>Confirm Your Email</h1>
        <p>Please click the button below to confirm your email address:</p>
        <p>
          <a href="${confirmationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
            Confirm Email
          </a>
        </p>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
    `;
  }

  private getPasswordResetTemplate(resetUrl: string): string {
    return `
      <div>
        <h1>Reset Your Password</h1>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <p>
          <a href="${resetUrl}" style="padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">
            Reset Password
          </a>
        </p>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `;
  }

  private getPostLikedTemplate(username: string, postTitle: string): string {
    return `
      <div>
        <h1>Your Post Was Liked!</h1>
        <p>Hello,</p>
        <p>${username} liked your post "${postTitle}".</p>
        <p>Log in to see their profile and engage with them!</p>
      </div>
    `;
  }

  private getNewFollowerTemplate(followerUsername: string): string {
    return `
      <div>
        <h1>New Follower!</h1>
        <p>Hello,</p>
        <p>${followerUsername} is now following you.</p>
        <p>Log in to see their profile and follow them back!</p>
      </div>
    `;
  }

  private getNewCommentTemplate(username: string, postTitle: string): string {
    return `
      <div>
        <h1>New Comment on Your Post</h1>
        <p>Hello,</p>
        <p>${username} commented on your post "${postTitle}".</p>
        <p>Log in to see what they said and continue the conversation!</p>
      </div>
    `;
  }
}
