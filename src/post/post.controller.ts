import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create(createPostDto, req.user as any);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updatePostDto: CreatePostDto,
    @Req() req: Request,
  ) {
    return this.postsService.update(+id, updatePostDto, req.user as any);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.remove(+id, req.user as any);
  }
}
