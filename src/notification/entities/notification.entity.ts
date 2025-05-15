import {
  Entity,
  ObjectIdColumn,
  ObjectId,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum NotificationType {
  LIKE = 'like',
  COMMENT = 'comment',
  FOLLOW = 'follow',
  MENTION = 'mention',
}

@Entity()
export class Notification {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  recipientId: string;

  @Column({ type: 'string' })
  type: NotificationType;

  @Column()
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ nullable: true })
  entityId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
