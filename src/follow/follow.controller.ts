import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

interface RequestWithUser extends Request {
  user: any;
}

@ApiTags('follows')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User followed successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Already following this user or trying to follow yourself',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async followUser(
    @Param('userId') userId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.followService.followUser(req.user.id, +userId);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'User unfollowed successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Follow relationship not found',
  })
  async unfollowUser(
    @Param('userId') userId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.followService.unfollowUser(req.user.id, +userId);
  }

  @Get('followers/:userId')
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all followers of a user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getFollowers(@Param('userId') userId: string) {
    return this.followService.getFollowers(+userId);
  }

  @Get('following/:userId')
  @ApiOperation({ summary: 'Get users followed by a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all users followed by a user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User not found',
  })
  async getFollowing(@Param('userId') userId: string) {
    return this.followService.getFollowing(+userId);
  }

  @Get('count/followers/:userId')
  @ApiOperation({ summary: 'Count followers of a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the count of followers for a user',
  })
  async countFollowers(@Param('userId') userId: string) {
    return {
      count: await this.followService.countFollowers(+userId),
    };
  }

  @Get('count/following/:userId')
  @ApiOperation({ summary: 'Count users followed by a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the count of users followed by a user',
  })
  async countFollowing(@Param('userId') userId: string) {
    return {
      count: await this.followService.countFollowing(+userId),
    };
  }

  @Get('check/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check if you follow a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns whether the current user follows the specified user',
  })
  async checkFollowing(
    @Param('userId') userId: string,
    @Req() req: RequestWithUser,
  ) {
    return {
      isFollowing: await this.followService.isFollowing(req.user.id, +userId),
    };
  }
}
