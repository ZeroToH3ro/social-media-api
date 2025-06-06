import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Follow } from './entities/follow.entity';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Follow, User]), QueueModule],
  controllers: [FollowController],
  providers: [FollowService],
  exports: [FollowService],
})
export class FollowModule {}
