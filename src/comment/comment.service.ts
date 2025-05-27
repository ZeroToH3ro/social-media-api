import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { EmailQueueService } from '../queue/services/email-queue.service';
import { Post } from '../post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private emailQueueService: EmailQueueService,
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    const post = await this.postsRepository.findOne({
      where: { id: createCommentDto.postId },
      relations: ['user'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const comment = this.commentsRepository.create({
      ...createCommentDto,
      user,
      post: { id: createCommentDto.postId },
    });

    const savedComment = await this.commentsRepository.save(comment);

    if (post.user && post.user.email && post.user.id !== user.id) {
      try {
        await this.emailQueueService.sendNewCommentNotification(
          post.user.email,
          user.username,
          post.title,
        );
      } catch (error) {
        console.error('Failed to queue new comment notification email:', error);
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
