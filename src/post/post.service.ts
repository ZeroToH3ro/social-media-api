import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    const post = this.postsRepository.create({ ...createPostDto, user });
    return this.postsRepository.save(post);
  }

  findAll() {
    return this.postsRepository.find({ relations: ['user', 'comments'] });
  }

  findOne(id: number) {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['user', 'comments'],
    });
  }

  async update(id: number, updatePostDto: CreatePostDto, user: User) {
    const post = await this.findOne(id);
    if (post !== null && post.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own posts');
    }
    return this.postsRepository.update(id, updatePostDto);
  }

  async remove(id: number, user: User) {
    const post = await this.findOne(id);
    if (post !== null && post.user.id !== user.id) {
      throw new ForbiddenException('You can only delete your own posts');
    }
    return this.postsRepository.delete(id);
  }
}
