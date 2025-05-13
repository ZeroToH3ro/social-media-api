import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  UseGuards,
  Req,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { LikeService } from './like.service';
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

@ApiTags('Like')
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('post/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like a post' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Post liked successfully',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User has already liked this post',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found',
  })
  async likePost(@Param('postId') postId: string, @Req() req: RequestWithUser) {
    return this.likeService.likePost(+postId, req.user);
  }

  @Delete('post/:postId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unlike a post' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Post unliked successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Like not found',
  })
  async unlikePost(
    @Param('postId') postId: string,
    @Req() req: RequestWithUser,
  ) {
    return this.likeService.unlikePost(+postId, req.user);
  }

  @Get('post/:postId')
  @ApiOperation({ summary: 'Get all likes for a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all likes for a post',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Post not found',
  })
  async getLikesByPostId(@Param('postId') postId: string) {
    return this.likeService.getLikesByPostId(+postId);
  }

  @Get('post/:postId/user/:userId')
  @ApiOperation({ summary: 'Check if a user has liked a post' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns whether the user has liked the post',
  })
  async hasUserLikedPost(
    @Param('postId') postId: string,
    @Param('userId') userId: string,
  ) {
    return {
      hasLiked: await this.likeService.hasUserLikedPost(+postId, +userId),
    };
  }

  @Get('user/:userId/posts')
  @ApiOperation({ summary: 'Get all posts liked by a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns all posts liked by the user',
  })
  async getLikedPostsByUser(@Param('userId') userId: string) {
    return this.likeService.getLikedPostsByUser(+userId);
  }

  @Get('user/:userId/posts/count')
  @ApiOperation({ summary: 'Count posts liked by a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the count of posts liked by the user',
  })
  async countLikedPostsByUser(@Param('userId') userId: string) {
    const posts = await this.likeService.getLikedPostsByUser(+userId);
    return {
      count: posts.length,
    };
  }
}
