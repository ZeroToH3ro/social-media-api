import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';

@Module({
  imports: [
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'email',
      adapter: BullAdapter,
    }),
    BullBoardModule.forFeature({
      name: 'notification',
      adapter: BullAdapter,
    }),
    BullModule.registerQueue({ name: 'email' }, { name: 'notification' }),
  ],
})
export class BullBoardAppModule {}
