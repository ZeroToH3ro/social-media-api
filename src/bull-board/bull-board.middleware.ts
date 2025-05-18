import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class BullBoardAuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Get auth details from request
    const authHeader = req.headers.authorization;

    // Simple auth check - in production use a more secure approach
    const adminUser = process.env.ADMIN_USER || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password';

    // Basic Auth check
    if (
      !authHeader ||
      authHeader !==
        `Basic ${Buffer.from(`${adminUser}:${adminPassword}`).toString('base64')}`
    ) {
      res.status(401).send('Unauthorized');
      return;
    }

    next();
  }
}
