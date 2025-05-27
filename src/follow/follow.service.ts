import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { EmailQueueService } from 'src/queue/services/email-queue.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailQueueService: EmailQueueService,
  ) {}

  async followUser(followerId: number, followingId: number) {
    // Prevent self-following
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const followingUser = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!followingUser || !followingUser.email) {
      throw new Error('User to follow not found or has no email.');
    }

    const followerUser = await this.userRepository.findOne({
      where: { id: followerId },
    });

    if (!followerUser) {
      throw new Error('Follower user not found.');
    }

    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existingFollow) {
      throw new Error('You are already following this user');
    }

    const follow = this.followRepository.create({
      follower: { id: followerId },
      following: { id: followingId },
    });

    await this.followRepository.save(follow);

    // Send notification to the followed user
    try {
      await this.emailQueueService.sendNewFollowerNotification(
        followingUser.email,
        followerUser.username,
      );
    } catch (error) {
      console.error('Failed to queue new follower notification email:', error);
      // Decide if you want to throw an error or just log it. For now, just logging.
    }

    return { message: 'Successfully followed user' };
  }

  async unfollowUser(followerId: number, followingId: number) {
    const result = await this.followRepository.delete({
      follower: { id: followerId },
      following: { id: followingId },
    });

    if (result.affected === 0) {
      throw new NotFoundException('Follow relationship not found');
    }
  }

  async getFollowers(userId: number): Promise<Follow[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowing(userId: number): Promise<Follow[]> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
  }

  async countFollowers(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.followRepository.count({
      where: { following: { id: userId } },
    });
  }

  async countFollowing(userId: number): Promise<number> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.followRepository.count({
      where: { follower: { id: userId } },
    });
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    return !!follow;
  }
}
