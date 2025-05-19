import { Injectable } from '@nestjs/common';
import { Listener } from '../../nats/nats.abstract.listener';
import { EventSubject } from '../../nats/nats.event';
import { NotificationQueueService } from '../../queue/services/notification-queue.service';

@Injectable()
export class PostLikedListener extends Listener<any> {
  postId: number;
  userId: number;
  eventSubject: EventSubject = EventSubject.POST_LIKED;
  consumerGroupName: string;
  subject = EventSubject.POST_LIKED;
  queueGroupName = 'notification-service';

  constructor(private notificationQueueService: NotificationQueueService) {
    super();
  }

  async onMessage(
    data: { postId: number; userId: number },
    event: any,
  ): Promise<void> {
    // Create a notification when a post is liked
    await this.notificationQueueService.createPostLikedNotification(
      data.userId, // Post owner ID
      Number(event.metadata.userId), // User who liked the post
      data.postId,
    );
  }
}

@Injectable()
export class CommentCreatedListener extends Listener<any> {
  eventSubject: EventSubject;
  consumerGroupName: string;
  subject = EventSubject.COMMENT_CREATED;
  queueGroupName = 'notification-service';

  constructor(private notificationQueueService: NotificationQueueService) {
    super();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onMessage(data: {
    post: {
      id: number;
      user: { id: number };
    };
    user: { id: number };
    id: number;
  }): Promise<void> {
    if (data.post && data.post.user && data.user) {
      const postAuthorId = data.post.user.id;
      const commentAuthorId = data.user.id;

      // Don't notify if the user is commenting on their own post
      if (postAuthorId !== commentAuthorId) {
        await this.notificationQueueService.createNewCommentNotification(
          postAuthorId,
          commentAuthorId,
          data.post.id,
          data.id,
        );
      }
    }
  }
}

@Injectable()
export class UserFollowedListener extends Listener<{
  followerId: number;
  followingId: number;
}> {
  eventSubject: EventSubject;
  consumerGroupName: string;
  subject = EventSubject.USER_FOLLOWED;
  queueGroupName = 'notification-service';

  constructor(private notificationQueueService: NotificationQueueService) {
    super();
  }

  async onMessage(data: {
    followerId: number;
    followingId: number;
  }): Promise<void> {
    await this.notificationQueueService.createNewFollowerNotification(
      data.followingId,
      data.followerId,
    );
  }
}
