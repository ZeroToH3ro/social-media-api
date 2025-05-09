import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../users/entities/user.entity';
import { Transform } from 'class-transformer';

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
}
