import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

export enum NotificationType {
  POST_LIKED = 'post-liked',
  NEW_FOLLOWER = 'new-follower',
  NEW_COMMENT = 'new-comment',
}

interface NotificationJobData {
  userId: number | string;
  type: NotificationType;
  metadata: Record<string, any>;
  isRead?: boolean;
}

@Injectable()
export class NotificationQueueService {
  constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

  async addNotificationJob(data: NotificationJobData) {
    return this.notificationQueue.add('create-notification', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
    });
  }

  async createPostLikedNotification(
    userId: number,
    likedByUserId: number,
    postId: number,
  ) {
    return this.addNotificationJob({
      userId,
      type: NotificationType.POST_LIKED,
      metadata: {
        likedByUserId,
        postId,
      },
      isRead: false,
    });
  }

  async createNewFollowerNotification(userId: number, followerUserId: number) {
    return this.addNotificationJob({
      userId,
      type: NotificationType.NEW_FOLLOWER,
      metadata: {
        followerUserId,
      },
      isRead: false,
    });
  }

  async createNewCommentNotification(
    userId: number,
    commentedByUserId: number,
    postId: number,
    commentId: number,
  ) {
    return this.addNotificationJob({
      userId,
      type: NotificationType.NEW_COMMENT,
      metadata: {
        commentedByUserId,
        postId,
        commentId,
      },
      isRead: false,
    });
  }
}
