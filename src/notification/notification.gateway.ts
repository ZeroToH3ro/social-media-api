import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationGateway.name);
  private userSocketMap: Map<string, string[]> = new Map();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove the client from userSocketMap
    this.userSocketMap.forEach((sockets, userId) => {
      const filteredSockets = sockets.filter(
        (socketId) => socketId !== client.id,
      );
      if (filteredSockets.length > 0) {
        this.userSocketMap.set(userId, filteredSockets);
      } else {
        this.userSocketMap.delete(userId);
      }
    });
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(client: Socket, userId: string) {
    if (!userId) {
      this.logger.warn(`No userId provided for authentication`);
      return;
    }

    this.logger.log(`User ${userId} authenticated on socket ${client.id}`);

    const existingSockets = this.userSocketMap.get(userId) || [];
    if (!existingSockets.includes(client.id)) {
      this.userSocketMap.set(userId, [...existingSockets, client.id]);
    }
  }

  sendNotificationToUser(userId: string, notification: any) {
    const socketIds = this.userSocketMap.get(userId);
    if (!socketIds || socketIds.length === 0) {
      this.logger.log(`No active sockets for user ${userId}`);
      return;
    }

    this.logger.log(
      `Sending notification to user ${userId} on ${socketIds.length} socket(s)`,
    );
    socketIds.forEach((socketId) => {
      this.server.to(socketId).emit('notification', notification);
    });
  }
}
