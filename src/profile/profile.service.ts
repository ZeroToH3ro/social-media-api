import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createProfileDto: CreateProfileDto, user: User) {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (profile) {
      throw new Error('Profile already exists for this user');
    }

    const result = this.profileRepository.create({
      ...createProfileDto,
      user,
    });

    await this.profileRepository.save(result);

    return result;
  }

  async findAll() {
    return this.profileRepository.find({
      relations: ['user'],
    });
  }

  async findByUserId(userId: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async findOne(id: number): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new Error('Profile not found');
    }
    return profile;
  }

  async update(
    id: number,
    updateProfileDto: UpdateProfileDto,
    user: User,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.user.id !== user.id) {
      throw new Error('You can only update your own profile');
    }

    await this.profileRepository.update(id, updateProfileDto);

    const updatedProfile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!updatedProfile) {
      throw new Error('Profile not found after update');
    }

    return updatedProfile;
  }

  async remove(id: number, user: User): Promise<void> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new Error('Profile not found');
    }

    if (profile.user.id !== user.id) {
      throw new Error('You can only delete your own profile');
    }

    await this.profileRepository.delete(id);
  }

  async updateAvatar(
    id: number,
    avatarUrl: string,
    user: User,
  ): Promise<Profile> {
    const profile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!profile) {
      throw new Error('Profile not found');
    }
    if (profile.user.id !== user.id) {
      throw Error('You can only update your own profile');
    }
    if (profile.avatar) {
      const publicId = this.extractPublicIdFromUrl(profile.avatar);
      await this.cloudinaryService.deleteFromCloudinary(publicId);
    }

    await this.profileRepository.update(id, { avatar: avatarUrl });
    const updatedProfile = await this.profileRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!updatedProfile) {
      throw new Error('Profile not found after update');
    }
    return updatedProfile;
  }

  private extractPublicIdFromUrl(url: string): string {
    const urlParts = url.split('/');
    const filenamePart = urlParts[urlParts.length - 1];
    return `social_media_avatars/${filenamePart.split('.')[0]}`;
  }
}
