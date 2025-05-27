import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { EmailQueueService } from '../queue/services/email-queue.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    private emailQueueService: EmailQueueService,
  ) {}

  async likePost(postId: number, user: User) {
    // Check if post exists
    const post = await this.postsRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });

    if (!post) {
      throw new Error('Post not found');
    }

    // Check if user has already liked the post
    const existingLike = await this.likesRepository.findOne({
      where: { post: { id: postId }, user: { id: user.id } },
    });

    if (existingLike) {
      throw new Error('You have already liked this post');
    }

    // Create new like
    const like = this.likesRepository.create({ post, user });
    await this.likesRepository.save(like);

    // Send notification to the post author
    if (post.user && post.user.email && post.user.id !== user.id) {
      try {
        await this.emailQueueService.sendPostLikedNotification(
          post.user.email,
          user.username,
          post.title,
        );
      } catch (error) {
        console.error('Failed to queue post liked notification email:', error);
        // Decide if you want to throw an error or just log it
      }
    }

    return { message: 'Post liked successfully' };
  }

  async unlikePost(postId: number, user: User): Promise<void> {
    const result = await this.likesRepository.delete({
      post: { id: postId },
      user: { id: user.id },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Like not found');
    }
  }

  async getLikesByPostId(postId: number): Promise<Like[]> {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${postId} not found`);
    }

    return this.likesRepository.find({
      where: { post: { id: postId } },
      relations: ['user'],
    });
  }

  async hasUserLikedPost(postId: number, userId: number): Promise<boolean> {
    const like = await this.likesRepository.findOne({
      where: {
        post: { id: postId },
        user: { id: userId },
      },
    });

    return !!like;
  }

  async getLikedPostsByUser(userId: number): Promise<Post[]> {
    const likes = await this.likesRepository.find({
      where: { user: { id: userId } },
      relations: ['post', 'post.user'],
    });

    return likes.map((like) => like.post);
  }
}
