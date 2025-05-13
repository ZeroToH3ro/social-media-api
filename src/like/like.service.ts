import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async likePost(postId: number, user: User): Promise<Like> {
    // Check post exists
    const postExist = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!postExist) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    const existingLike = await this.likeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: user.id },
      },
    });

    if (existingLike) {
      throw new ConflictException('You have already like this post');
    }

    const like = this.likeRepository.create({
      post: postExist,
      user,
    });

    return this.likeRepository.save(like);
  }

  async unlikePost(postId: number, user: User): Promise<void> {
    const result = await this.likeRepository.delete({
      post: { id: postId },
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Like not found');
    }
  }

  async getLikesByPostId(postId: number): Promise<Like[]> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.likeRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    return !!like;
  }

  async getLikedPostsByUser(userId: number): Promise<Post[]> {
    const likes = await this.likeRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user'],
    });

    return likes.map((like) => like.post);
  }
}
