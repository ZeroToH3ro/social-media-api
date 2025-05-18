import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { Comment } from './entities/comment.entity';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), QueueModule],
  providers: [CommentService],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
