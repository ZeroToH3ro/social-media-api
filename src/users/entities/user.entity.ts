import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Follow } from 'src/follow/entities/follow.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string;

  @Column()
  isEmailConfirmed?: boolean;

  @Column()
  email: string;

  @Column()
  confirmationToken?: string;

  @Column({ nullable: true })
  resetPasswordToken?: string;

  @Column({ nullable: true })
  resetPasswordExpires?: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follow, (user) => user.following)
  following: Follow[];

  @OneToMany(() => Follow, (user) => user.follower)
  followers: Follow;
}
