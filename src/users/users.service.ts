import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto';

@Injectable()
export class UsersService {
  /**
   *
   */
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  findOneById(id: number) {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string) {
    return this.usersRepository.findOneBy({ username });
  }
}
