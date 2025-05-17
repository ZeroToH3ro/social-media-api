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
- Modular, scalable codebase

---

## Tech Stack

- **Backend:** NestJS, TypeORM
- **Databases:** MySQL (main data), MongoDB (notifications)
- **Real-time:** WebSockets (Socket.IO)
- **Cloud Storage:** Cloudinary

---

## Project Setup

```bash
pnpm install
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
```

---

## Running the Project

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# production mode
pnpm run start:prod
```

---

## Real-Time Notifications

- The API uses Socket.IO for real-time notifications.
- Clients should connect with their userId as a query parameter:

```js
import { io } from "socket.io-client";
const socket = io('http://localhost:3000', { query: { userId: 'USER_ID' } });
socket.on('notification', (data) => {
  // handle notification
});
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

See [NestJS deployment docs](https://docs.nestjs.com/deployment).

---

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Community](https://discord.gg/G7Qnnhy)
- [Devtools](https://devtools.nestjs.com)

---

## License

MIT
