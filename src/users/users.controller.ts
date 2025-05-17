import {
  Controller,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: Request) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return this.usersService.findOneById((req.user as any).id);
  }

  @Get('confirm')
  async confirmEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Token is required');
    }
    const user = await this.usersService.findUserByConfirmationToken(token);
    if (!user) throw new BadRequestException('Invalid or expired token');

    user.isEmailConfirmed = true;
    user.confirmationToken = undefined;

    await this.usersService.save(user); // Use the service method

    return {
      status: HttpStatus.OK,
      message: 'Email confirmed successfully!',
    };
  }
}
