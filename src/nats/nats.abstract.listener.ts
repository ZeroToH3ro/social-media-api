import {
  MessagePattern,
  Payload,
  Ctx,
  NatsContext,
} from '@nestjs/microservices';
import { Event, EventSubject } from './nats.event';

export abstract class Listener<T> {
  abstract eventSubject: EventSubject;
  abstract consumerGroupName: string;
  abstract onMessage(data: T, event: Event<T>): Promise<void>;

  @MessagePattern(EventSubject)
  async listen(@Payload() event: Event<T>, @Ctx() context: NatsContext) {
    try {
      if (
        this.eventSubject &&
        context.getSubject() === this.eventSubject.toString()
      ) {
        await this.onMessage(event.data, event);
      }
    } catch (error) {
      console.error(
        `Error processing message on subject "${this.eventSubject.toString()}" with event data: ${JSON.stringify(event.data)}. Error: ${error.message}`,
      );
    }
  }
}
