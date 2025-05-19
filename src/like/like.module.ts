import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Post } from 'src/post/entities/post.entity';
import { Like } from './entities/like.entity';
import { QueueModule } from 'src/queue/queue.module';
import { PostLikedPublisher } from '../events/publishers/post.publishers';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Post]), QueueModule],
  providers: [LikeService, PostLikedPublisher],
  controllers: [LikeController],
  exports: [LikeService],
})
export class LikeModule {}
