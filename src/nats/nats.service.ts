import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientNats } from '@nestjs/microservices';
import { Observable, timeout, firstValueFrom } from 'rxjs';

@Injectable()
export class NatsService {
  private readonly logger = new Logger(NatsService.name);

  constructor(@Inject('NATS_CLIENT') private readonly natsClient: ClientNats) {}

  async onModuleInit() {
    await this.natsClient.connect();
    this.logger.log('NATS client connected');
  }

  async onModuleDestroy() {
    await this.natsClient.close();
    this.logger.log('NATS client disconnected');
  }

  publish(subject: string, data: any): void {
    try {
      this.logger.debug(`Publishing to ${subject}: ${JSON.stringify(data)}`);
      this.natsClient.emit(subject, data);
    } catch (error) {
      this.logger.error(`Error publishing to ${subject}`, error.stack);
    }
  }

  async Request<T>(
    subject: string,
    data: any,
    timeoutMs: number = 5000,
  ): Promise<T> {
    try {
      this.logger.debug(
        `Sending request to ${subject}: ${JSON.stringify(data)}`,
      );
      const response$: Observable<T> = this.natsClient.send(subject, data);
      const response = await firstValueFrom(response$.pipe(timeout(timeoutMs)));

      return response;
    } catch (error) {
      this.logger.error(`Error requesting from ${subject}`, error.stack);
      throw error;
    }
  }
}
