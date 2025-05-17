import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';
import { randomBytes } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    if (
      !createUserDto.password &&
      createUserDto.confirmPassword != createUserDto.password
    ) {
      throw new Error("Password don't match");
    }

    const confirmationToken = randomBytes(32).toString('hex');
    const user = this.usersRepository.create({
      ...createUserDto,
      isEmailConfirmed: false,
      confirmationToken,
    });
    // Send confirmation email here
    return this.usersRepository.save(user);
  }

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }

  async findUnconfirmedUser(): Promise<User[]> {
    const result = await this.usersRepository.find({
      where: { isEmailConfirmed: false },
    });

    return result;
  }

  async findUserByConfirmationToken(token: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { confirmationToken: token },
    });

    if (!user) throw new BadRequestException('Token is not valid');
    return user;
  }

  async save(user: User) {
    return this.usersRepository.save(user);
  }
}
