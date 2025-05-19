import { Module } from '@nestjs/common';
import {
  PostCreatedPublisher,
  PostLikedPublisher,
  PostUnlikedPublisher,
} from './publishers/post.publishers';
import { CommentCreatedPublisher } from './publishers/comment.publishers';
import {
  UserFollowedPublisher,
  UserUnfollowedPublisher,
} from './publishers/follow.publishers';
import {
  PostLikedListener,
  CommentCreatedListener,
  UserFollowedListener,
} from './listeners/notification-listeners';
import { QueueModule } from '../queue/queue.module';
import { NatsModule } from '../nats/nats.module';

@Module({
  imports: [QueueModule, NatsModule],
  providers: [
    // Publishers
    PostCreatedPublisher,
    PostLikedPublisher,
    PostUnlikedPublisher,
    CommentCreatedPublisher,
    UserFollowedPublisher,
    UserUnfollowedPublisher,

    // Listeners
    PostLikedListener,
    CommentCreatedListener,
    UserFollowedListener,
  ],
  exports: [
    PostCreatedPublisher,
    PostLikedPublisher,
    PostUnlikedPublisher,
    CommentCreatedPublisher,
    UserFollowedPublisher,
    UserUnfollowedPublisher,
  ],
})
export class EventsModule {}
