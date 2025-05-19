import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { CommentCreatedPublisher } from '../events/publishers/comment.publishers';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private commentCreatedPublisher: CommentCreatedPublisher,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      user,
    });

    const savedComment = await this.commentsRepository.save(comment);

    // Publish comment created event
    this.commentCreatedPublisher.publish(
      {
        id: savedComment.id,
        content: savedComment.content,
        user: savedComment.user,
        post: savedComment.post,
      },
      user.id,
    );

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
