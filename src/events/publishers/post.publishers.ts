import { Injectable } from '@nestjs/common';
import { Publisher } from '../../nats/nats.abstract.publisher';
import { EventSubject } from '../../nats/nats.event';
import { Post } from '../../post/entities/post.entity';
import { NatsService } from '../../nats/nats.service';

@Injectable()
export class PostCreatedPublisher extends Publisher<Post> {
  subject = EventSubject.POST_CREATED;

  constructor(protected natsService: NatsService) {
    super(natsService);
  }
}

@Injectable()
export class PostLikedPublisher extends Publisher<{
  postId: number;
  userId: number;
}> {
  subject = EventSubject.POST_LIKED;

  constructor(protected natsService: NatsService) {
    super(natsService);
  }
}

@Injectable()
export class PostUnlikedPublisher extends Publisher<{
  postId: number;
  userId: number;
}> {
  subject = EventSubject.POST_UNLIKED;

  constructor(protected natsService: NatsService) {
    super(natsService);
  }
}
