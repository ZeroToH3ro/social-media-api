import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserFollowedPublisher } from '../events/publishers/follow.publishers';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userFollowedPublisher: UserFollowedPublisher,
  ) {}

  async followUser(followerId: number, followingId: number) {
    // Prevent self-following
    if (followerId === followingId) {
      throw new Error('You cannot follow yourself');
    }

    const followingUser = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!followingUser) {
      throw new Error('User not found');
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

    // Publish user followed event
    this.userFollowedPublisher.publish({ followerId, followingId }, followerId);

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
