import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { User } from './users/entities/user.entity';
import { Post } from './post/entities/post.entity';
import { Comment } from './comment/entities/comment.entity';
import { LikeController } from './like/like.controller';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { ProfileModule } from './profile/profile.module';
import { TagModule } from './tag/tag.module';
import { NotificationModule } from './notification/notification.module';
import { Like } from './like/entities/like.entity';
import { Profile } from './profile/entities/profile.entity';
import { Follow } from './follow/entities/follow.entity';
import { Tag } from './tag/entities/tag.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'zero21052002',
      database: 'social_media',
      synchronize: true,
      entities: [User, Comment, Post, Like, Profile, Tag, Follow],
    }),
    AuthModule,
    UsersModule,
    CommentModule,
    PostModule,
    LikeModule,
    FollowModule,
    ProfileModule,
    TagModule,
    NotificationModule,
    CloudinaryModule,
  ],
  controllers: [
    AppController,
    UsersController,
    CommentController,
    PostController,
    LikeController,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    AppService,
  ],
})
export class AppModule {}
