import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { EmailQueueService } from '../queue/services/email-queue.service';
import { NotificationQueueService } from '../queue/services/notification-queue.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private emailQueueService: EmailQueueService,
    private notificationQueueService: NotificationQueueService,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      user,
    });

    const savedComment = await this.commentsRepository.save(comment);

    // Get post author to send notification
    const postAuthorId = savedComment.post?.user?.id;

    // Only create notification if the post author isn't the same as the commenter
    if (postAuthorId && postAuthorId !== user.id) {
      // Add notification to queue
      await this.notificationQueueService.createNewCommentNotification(
        postAuthorId,
        user.id,
        createCommentDto.postId,
        savedComment.id,
      );

      // If we have the post author's email, send an email notification
      if (savedComment.post?.user?.email) {
        await this.emailQueueService.sendNewCommentNotification(
          savedComment.post.user.email,
          user.username,
          savedComment.post.title || `Post #${createCommentDto.postId}`,
        );
      }
    }

    return savedComment;
  }

  findOne(id: number) {
    return this.commentsRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
  }

  findAll() {
    return this.commentsRepository.find({ relations: ['user', 'post'] });
  }

  async update(id: number, updateCommentDto: CreateCommentDto, user: User) {
    const comment = await this.findOne(id);
    if (comment !== null && comment.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.commentsRepository.update(id, updateCommentDto);
  }

  async remove(id: number, user: User) {
    const comment = await this.findOne(id);
    if (comment !== null && comment.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    return this.commentsRepository.delete(id);
  }
}
