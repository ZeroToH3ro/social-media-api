import { Entity, Column, ObjectIdColumn } from 'typeorm';
import { NotificationType } from '../../queue/services/notification-queue.service';

@Entity()
export class Notification {
  @ObjectIdColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  content: string;

  @Column()
  type: NotificationType;

  @Column()
  metadata: Record<string, any>;

  @Column({ default: false })
  isRead: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
