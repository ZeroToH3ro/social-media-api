import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Transform } from 'class-transformer';
import { Like } from '../../like/entities/like.entity';
import { Tag } from 'src/tag/entities/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  @Transform(({ value }: { value: User }) => {
    if (value) {
      delete value.password;
    }
    return value;
  })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @ManyToMany(() => Tag, (tag) => tag.posts)
  tags: Tag[];
}
