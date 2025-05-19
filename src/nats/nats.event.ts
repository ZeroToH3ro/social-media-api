export enum EventSubject {
  // User events
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',

  // Post events
  POST_CREATED = 'post.created',
  POST_UPDATED = 'post.updated',
  POST_DELETED = 'post.deleted',

  // Like events
  POST_LIKED = 'post.liked',
  POST_UNLIKED = 'post.unliked',

  // Comment events
  COMMENT_CREATED = 'comment.created',
  COMMENT_UPDATED = 'comment.updated',
  COMMENT_DELETED = 'comment.deleted',

  // Follow events
  USER_FOLLOWED = 'user.followed',
  USER_UNFOLLOWED = 'user.unfollowed',

  // Notification events
  NOTIFICATION_CREATED = 'notification.created',
  NOTIFICATION_READ = 'notification.read',

  // Analytics events
  USER_ACTIVITY = 'analytics.user_activity',
  CONTENT_ENGAGEMENT = 'analytics.content_engagement',
}

// Base interface for all events
export interface Event<T> {
  subject: EventSubject;
  data: T;
  metadata: {
    timestamp: string;
    userId?: string | number;
    traceId?: string;
  };
}
