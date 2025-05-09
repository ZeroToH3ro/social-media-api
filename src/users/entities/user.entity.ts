import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Post } from '../../post/entities/post.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
