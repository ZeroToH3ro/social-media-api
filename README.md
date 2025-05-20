<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Social Media API

A full-stack social media API built with [NestJS](https://nestjs.com/), supporting MySQL for core data and MongoDB for notifications, with real-time notification delivery using WebSockets.

---

## Features

- User authentication & authorization
- Posts, comments, likes, follows, tags, and profiles
- File uploads with Cloudinary
- **Notifications stored in MongoDB**
- **Real-time notifications via WebSockets (Socket.IO)**
- **Message queuing with Bull/Redis**
- **Event-driven architecture with NATS**
- Modular, scalable codebase

---

## Tech Stack

- **Backend:** NestJS, TypeORM
- **Databases:** MySQL (main data), MongoDB (notifications)
- **Real-time:** WebSockets (Socket.IO)
- **Message Broker:** NATS
- **Queue System:** Bull/Redis
- **Cloud Storage:** Cloudinary

---

## Project Setup

### Traditional Setup

```bash
pnpm install
```

### Docker Setup (Recommended)

The project includes Docker configuration for easy setup and consistent environments.

1. **Prerequisites**:
   - [Docker](https://www.docker.com/products/docker-desktop/)
   - [Docker Compose](https://docs.docker.com/compose/install/) (included with Docker Desktop)

2. **Starting the application**:

```bash
# Start all services
docker-compose up

# Run in background
docker-compose up -d

# Build and start (after code changes)
docker-compose up --build
```

This will start the following services:
- NestJS application (API)
- MySQL database
- MongoDB
- Redis (for Bull queue)
- NATS (message broker)

3. **Stopping the application**:

```bash
docker-compose down

# To remove volumes as well (will delete data)
docker-compose down -v
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# MySQL Database
DB_USERNAME=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=social_media
DB_HOST=localhost

# MongoDB Database
MG_DBNAME=social_media_mongo
MG_HOST=localhost

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (for Bull Queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# NATS
NATS_URL=nats://localhost:4222

# Bull Board Admin
ADMIN_USER=admin
ADMIN_PASSWORD=securepassword
```

When using Docker, the database hosts will be the service names:
```
DB_HOST=mysql
MG_HOST=mongodb
REDIS_HOST=redis
NATS_URL=nats://nats:4222
```

---

## Running the Project

### Without Docker

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

### With Docker

```bash
# Development mode
docker-compose up

# Production mode
docker-compose -f docker-compose.prod.yml up
```

---

## Accessing Services

- **API**: http://localhost:3000
- **API Documentation**: http://localhost:3000/api
- **Bull Board** (Queue Monitor): http://localhost:3000/admin/queues
  - Default credentials: admin/password (configurable in .env)

---

## Real-Time Notifications

- The API uses Socket.IO for real-time notifications.
- Clients should connect with authentication:

```js
import { io } from "socket.io-client";
const socket = io('http://localhost:3000/notifications', {
  auth: { token: 'YOUR_JWT_TOKEN' }
});

socket.on('notification', (notification) => {
  // handle new notification
});

socket.on('unread_count', (data) => {
  // update notification badge with data.count
});
```

---

## Docker Commands

```bash
# View container logs
docker-compose logs -f api

# Access shell in container
docker-compose exec api sh

# Run tests
docker-compose exec api pnpm test

# Rebuild a specific service
docker-compose up -d --no-deps --build api
```

---

## Testing

```bash
# unit tests
pnpm run test

# e2e tests
pnpm run test:e2e

# test coverage
pnpm run test:cov
```

---

## Deployment

### Docker-based Deployment

1. Configure production environment variables
2. Run with production compose file:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

For cloud deployments, see [NestJS deployment docs](https://docs.nestjs.com/deployment).

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Docker Documentation](https://docs.docker.com/)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull/blob/master/REFERENCE.md)
- [NATS Documentation](https://docs.nats.io/)
- [Discord Community](https://discord.gg/G7Qnnhy)
- [Devtools](https://devtools.nestjs.com)

---

## License

MIT
