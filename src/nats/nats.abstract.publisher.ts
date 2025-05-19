import { NatsService } from './nats.service';
import { Event, EventSubject } from './nats.event';

export abstract class Publisher<T> {
  abstract subject: EventSubject;

  constructor(protected natsService: NatsService) {}

  publish(data: T, userId?: string | number) {
    const event: Event<T> = {
      subject: this.subject,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        userId: userId?.toString(),
        traceId: Math.random().toString(36).substring(2, 15),
      },
    };

    this.natsService.publish(this.subject, event);
  }
}
