import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NatsService } from './nats.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'NATS_CLIENT',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: [
              configService.get<string>('NATS_URL', 'nats://localhost:4222'),
            ],
            queue: 'social_media_queue',
          },
        }),
      },
    ]),
  ],
  providers: [NatsService],
  exports: [NatsService],
})
export class NatsModule {}
