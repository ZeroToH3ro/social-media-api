import { Process, Processor } from '@nestjs/bull';
import { Logger, Inject, forwardRef } from '@nestjs/common';
import { Job } from 'bull';
import { NotificationService } from '../../notification/notification.service';
import { NotificationGateway } from '../../notification/notification.gateway';
import { NotificationType } from '../services/notification-queue.service';

interface NotificationJobData {
  userId: string | number;
  type: NotificationType;
  metadata: Record<string, any>;
  isRead?: boolean;
}

@Processor('notification')
export class NotificationQueueProcessor {
  private readonly logger = new Logger(NotificationQueueProcessor.name);

  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => NotificationGateway))
    private readonly notificationGateway: NotificationGateway,
  ) {}

  @Process('create-notification')
  async handleCreateNotification(job: Job<NotificationJobData>) {
    this.logger.debug(
      `Processing notification job ${job.id} of type ${job.data.type}`,
    );
    const { userId, type, metadata, isRead } = job.data;

    try {
      // Format content based on notification type
      const content = this.formatNotificationContent(type);

      // Create notification in database
      const notification = await this.notificationService.create({
        userId: userId.toString(),
        content,
        type,
        metadata,
        isRead: isRead || false,
      });

      // Send real-time notification using WebSockets
      this.notificationGateway.sendNotificationToUser(
        userId.toString(),
        notification,
      );

      this.logger.log(
        `Notification created and sent to user ${userId} successfully`,
      );
      return notification;
    } catch (error) {
      this.logger.error(
        `Failed to create notification for user ${userId}`,
        error.stack,
      );
      throw error;
    }
  }

  private formatNotificationContent(type: NotificationType): string {
    switch (type) {
      case NotificationType.POST_LIKED:
        return `Someone liked your post`;
      case NotificationType.NEW_FOLLOWER:
        return `You have a new follower`;
      case NotificationType.NEW_COMMENT:
        return `Someone commented on your post`;
      default:
        return `You have a new notification`;
    }
  }
}
