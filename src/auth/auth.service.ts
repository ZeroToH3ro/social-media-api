/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/entities/user.entity';
import { compare, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    password: string,
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOneByUsername(username);

    if (user && user.password) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const isMatch = await compare(password, user.password);

      if (isMatch) {
        // Destructuring with rest to remove password
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...result } = user;
        return result;
      }
    }
    return null;
  }

  login(user: { username: string; id: number }): { access_token: string } {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<User> {
    const hashedPassword = await hash(password, 10);
    const hashedConfirmPassword = await hash(confirmPassword, 10);

    return this.usersService.create({
      username,
      email,
      password: hashedPassword,
      confirmPassword: hashedConfirmPassword,
    });
  }
}
