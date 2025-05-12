import { Exclude } from 'class-transformer';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @Exclude({ toPlainOnly: true })
  user: User;

  @ManyToOne(() => Post, (post) => post.likes)
  post: Post;
}
