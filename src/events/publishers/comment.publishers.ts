import { Injectable } from '@nestjs/common';
import { Publisher } from 'src/nats/nats.abstract.publisher';
import { EventSubject } from 'src/nats/nats.event';
import { NatsService } from 'src/nats/nats.service';
import { Comment } from 'src/comment/entities/comment.entity';

@Injectable()
export class CommentCreatedPublisher extends Publisher<Comment> {
  subject = EventSubject.COMMENT_CREATED;
  constructor(protected natsService: NatsService) {
    super(natsService);
  }
}
