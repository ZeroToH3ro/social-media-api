import {
  Controller,
  Get,
  UseGuards,
  Req,
  BadRequestException,
  Query,
  HttpStatus,
  Post,
  Body,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { Request } from 'express';
import { EmailQueueService } from '../queue/services/email-queue.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private emailQueueService: EmailQueueService,
  ) {}

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

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return {
        status: HttpStatus.OK,
        message:
          'If your email is registered, you will receive a password reset link.',
      };
    }

    // Generate a password reset token (you might want to use a more secure method like crypto.randomBytes)
    const resetToken =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = resetToken;
    // Set an expiry for the token, e.g., 1 hour from now
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    await this.usersService.save(user);

    try {
      await this.emailQueueService.sendPasswordResetEmail(
        user.email,
        resetToken,
      );
      return {
        status: HttpStatus.OK,
        message: 'Password reset email sent successfully.',
      };
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new BadRequestException('Could not send password reset email.');
    }
  }
}
