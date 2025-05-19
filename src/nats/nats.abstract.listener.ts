import {
  MessagePattern,
  Payload,
  Ctx,
  NatsContext,
} from '@nestjs/microservices';
import { Event, EventSubject } from './nats.event';

export abstract class Listener<T> {
  abstract subject: EventSubject;
  abstract queueGroupName: string;
  abstract onMessage(data: T, event: Event<T>): Promise<void>;

  @MessagePattern()
  async listen(@Payload() event: Event<T>, @Ctx() context: NatsContext) {
    try {
      if (context.getSubject() === this.subject.toString()) {
        await this.onMessage(event.data, event);
      }
    } catch (error) {
      console.error(`Error processing message: ${error.message}`);
    }
  }
}
