import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from '../users/entities/user.entity';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user: User) {
    const comment = this.commentRepository.create({
      ...createCommentDto,
      user,
    });
    return this.commentRepository.save(comment);
  }

  findOne(id: number) {
    return this.commentRepository.findOne({
      where: { id },
      relations: ['user', 'post'],
    });
  }

  findAll() {
    return this.commentRepository.find({ relations: ['user', 'post'] });
  }

  async update(id: number, updateCommentDto: CreateCommentDto, user: User) {
    const comment = await this.findOne(id);
    if (comment !== null && comment.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own comments');
    }

    return this.commentRepository.update(id, updateCommentDto);
  }

  async remove(id: number, user: User) {
    const comment = await this.findOne(id);
    if (comment !== null && comment.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own comments');
    }
    return this.commentRepository.delete(id);
  }
}
