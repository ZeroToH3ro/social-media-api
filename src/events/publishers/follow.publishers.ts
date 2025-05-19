import { Injectable } from '@nestjs/common';
import { Publisher } from '../../nats/nats.abstract.publisher';
import { EventSubject } from '../../nats/nats.event';
import { NatsService } from '../../nats/nats.service';

interface FollowEvent {
  followerId: number;
  followingId: number;
}

@Injectable()
export class UserFollowedPublisher extends Publisher<FollowEvent> {
  subject = EventSubject.USER_FOLLOWED;

  constructor(protected natsService: NatsService) {
    super(natsService);
  }
}

@Injectable()
export class UserUnfollowedPublisher extends Publisher<FollowEvent> {
  subject = EventSubject.USER_UNFOLLOWED;

  constructor(protected natsService: NatsService) {
    super(natsService);
  }
}
