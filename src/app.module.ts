import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { CommentController } from './comment/comment.controller';
import { CommentModule } from './comment/comment.module';
import { PostController } from './post/post.controller';
import { PostModule } from './post/post.module';
import { User } from './users/entities/user.entity';
import { Post } from './post/entities/post.entity';
import { Comment } from './comment/entities/comment.entity';
import { Notification } from './notification/entities/notification.entity';
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
import * as dotenv from 'dotenv';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { TasksModule } from './tasks/tasks.module';
import { QueueModule } from './queue/queue.module';
import { BullBoardAppModule } from './bull-board/bull-board.module';
import { NatsModule } from './nats/nats.module';
import { EventsModule } from './events/events.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: true,
      entities: [User, Comment, Post, Like, Profile, Tag, Follow],
    }),
    TypeOrmModule.forRoot({
      name: 'mongodb',
      type: 'mongodb',
      host: process.env.MG_HOST,
      port: 27017,
      database: process.env.MG_DBNAME,
      synchronize: true,
      entities: [Notification],
    }),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
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
    TasksModule,
    QueueModule,
    BullBoardAppModule,
    NatsModule,
    EventsModule,
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
