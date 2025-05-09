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
      // entities: [__dirname + '/../**/*.entity.{js,ts}'],
      entities: [User, Comment, Post],
    }),
    AuthModule,
    UsersModule,
    CommentModule,
    PostModule,
  ],
  controllers: [
    AppController,
    UsersController,
    CommentController,
    PostController,
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
