import { PrimaryGeneratedColumn, Column, OneToMany, Entity } from 'typeorm';
import { Post } from '../../post/entities/post.entities';
import { Comment } from '../../comment/entities/comment.entities';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
