import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follow } from './entities/follow.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async followUser(followerId: number, followingId: number): Promise<Follow> {
    if (followerId === followingId) {
      throw new ConflictException('You can not follow yourself');
    }

    const follower = await this.userRepository.findOne({
      where: {
        id: followerId,
      },
    });
    if (!follower) {
      throw new NotFoundException(`User with ID ${followerId} not found`);
    }

    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });
    if (!following) {
      throw new NotFoundException(`User with ID ${followingId} not found`);
    }

    const existingFollow = await this.followRepository.findOne({
      where: {
        follower: { id: followerId },
        following: { id: followingId },
      },
    });

    if (existingFollow) {
      throw new ConflictException('You are already following this user');
    }

    const follow = this.followRepository.create({
      follower,
      following,
    });

    return this.followRepository.save(follow);
  }

  // Unfollow a user
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

  // Get users followed by a user
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
    // Check if user exists
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.followRepository.count({
      where: { following: { id: userId } },
    });
  }

  async countFollowing(userId: number): Promise<number> {
    // Check if user exists
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
